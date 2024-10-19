from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Sum
from knox.auth import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from knox import views as knox_views
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework import status
from django.db import IntegrityError
import os
from .choices import Months
import uuid
import io
import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import pandas as pd
from io import BytesIO
import xlsxwriter
from fuzzywuzzy import process
from django.http import HttpResponse
import requests
from fuzzywuzzy import fuzz
from .models import Transport,UserTransportSubmission,UserElectricitySubmission,EnergyConsumption, FuelConsumption, Vehicles, Transport, AdditionalFiles, UserSurveyQuestions,SalesFinanceData,UserEligibility
from .serializers import TransportDataSerializer,MonthsSerializer,EnergyConsumptionSerializer, FuelConsumptionSerializer, VehiclesSerializer,EndOfLifeProduct, \
    TransportSerializer, AdditionalFilesSerializer, SurveyQuestionsSerializer,FuelTypeSerializer,ConsumptionUnitSerializer,TransportModesSerializer,WeightUnitsSerializer,GETVehiclesSerializer,VehicleTypeSerializer,SupplyChainRawMaterialSerializer, \
    SalesFinanceDataSerializer,SupplyChainRawMaterial,UserEligibilitySerializer,IndustrySerializer,SubSectorSerializer,CountrySerializer,ActivityPerformedSerializer,DataAvailableSerializer,EndOfLifeProductSerializer
from .climatiq_api_utils import call_climatiq_api_for_steel, call_climatiq_api_for_iron
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .choices import Months,COUNTRY_CHOICES,INDUSTRY_CHOICES,SUB_SECTOR_CHOICES,COUNTRY,ACTIVITY_PERFORMED_CHOICES,DATA_AVAILABLE_CHOICES,DATA_AVAILABLE_CHOICES
from rest_framework.parsers import MultiPartParser, FormParser

# class GetEnergyConsumptionAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             user_consumptions = EnergyConsumption.objects.filter(user=user,
#                                                                  financial_year=request.data.get('financial_year'))
#             serializer = EnergyConsumptionSerializer(user_consumptions, many=True)
#             data = serializer.data
#             if len(data) > 0:
#                 return Response(data[0])
#             else:
#                 return Response("")
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class UploadEnergyConsumptionAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             if request.data.get('consumption') == '':
#                 return Response({'consumption': 'consumption is needed'}, status=400)
#             if request.data.get('financial_year') == '':
#                 return Response({'financial_year': 'Financial Year is needed'}, status=400)
#             existing_consumption = EnergyConsumption.objects.filter(financial_year=request.data.get('financial_year'))
#             uploaded_files = request.FILES.getlist('files')
#             uploaded_files_list = []
#             for uploaded_file in uploaded_files:
#                 file_path = default_storage.save('energy/' + uploaded_file.name,
#                                                  ContentFile(uploaded_file.read()))
#                 uploaded_files_list.append(file_path)
#             if len(uploaded_files_list) == 0:
#                 return Response({'files': 'At-least one reference file should be attached'}, status=500)
#             if len(existing_consumption) > 0:
#                 # uploaded_files_list.append(existing_attachments[0].files_list) # updates list
#                 EnergyConsumption.objects.update(user=user, files_list=uploaded_files_list,
#                                                  financial_year=request.data.get('financial_year'),
#                                                  consumption=request.data.get('consumption'))

#             else:
#                 attachments = EnergyConsumption(user=user, files_list=uploaded_files_list,
#                                                 financial_year=request.data.get('financial_year'),
#                                                 consumption=request.data.get('consumption'))
#                 attachments.save()
#             return Response({})
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)

###################################################################################
##################### Fuel Consumption ############################################
EMISSION_FACTORS = {
        'Diesel': 4,  # kgCO2e per litre
        'Kerosene': 3,  # kgCO2e per litre
        'Propane': 2.5,  # kgCO2e per litre
        'Butane': 2.8,  # kgCO2e per litre
        'Petrol': 2,  # kgCO2e per litre
        'Coal': 2.2,  # kgCO2e per kg
        'Natural Gas': 2.5,  # kgCO2e per kg
        'Other': 3,  # Random emission factor
        'None': 0,  # No emissions
    }
class FuelConsumptionMonthUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        month = request.data.get('month')
        year = request.data.get('year')
        file = request.FILES.get('file')
        fuel_type = request.data.get('fuel_type')
        consumption_quantity = request.data.get('consumption_quantity')
        consumption_unit = request.data.get('consumption_unit')
        
        # Check if yearly data exists
        if FuelConsumption.objects.filter(user=user, year=year, has_submitted_yearly=True).exists():
            return Response({"error": "You have already uploaded yearly data for this year. Monthly data cannot be submitted."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate month and year choices
        month_choices = [choice[0] for choice in Months]
        if not month or month not in month_choices or not year:
            return Response({'detail': 'Invalid month or year choice.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file
        if not file:
            return Response({'detail': 'File is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file extension
        file_extension = os.path.splitext(file.name)[1].lower()
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        if file_extension not in allowed_extensions:
            return Response({'error': 'Unsupported file type. Only PDF and image files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the file
            file_name = f'{month}_{year}{file_extension}'
            file_path = f'Fuel Consumption Monthly Bill/{user.id}/{file_name}'
            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))

            # Get or create FuelConsumption record
            submission, created = FuelConsumption.objects.get_or_create(user=user, defaults={'year': year})

            # If the year is different, reset submitted months
            if submission.year != year:
                submission.has_submitted_monthly = True
                submission.submitted_months = {}  # Reset the months if year changes
                submission.has_submitted_yearly = False  # Since the year is reset, yearly submission is false
            submission.has_submitted_monthly = True
            submission.fuel_data_yearly={}
            submission.year = year

            # Check if the same fuel type has already been submitted for the month
            if submission.has_submitted_fuel_type_for_month(month, fuel_type):
                return Response({
                    'error': f'Fuel type "{fuel_type}" for month {month} has already been submitted.'
                }, status=status.HTTP_400_BAD_REQUEST)

            
            emission_factor = EMISSION_FACTORS.get(fuel_type)
            if not emission_factor:
                return Response({'error': 'Emission factor for this fuel type is not available.'}, status=status.HTTP_400_BAD_REQUEST)

            # Calculate CO2e value
            try:
                consumption_quantity = float(consumption_quantity)
                co2e_value = (consumption_quantity * emission_factor) / 1000
            except ValueError:
                return Response({'error': 'Consumption quantity must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)
   
            # Mark the month as submitted with the fuel details
            submission.mark_month_submitted(
                month,
                fuel_type=fuel_type,
                consumption_quantity=consumption_quantity,
                consumption_unit=consumption_unit,
                co2e_value=co2e_value             
            )          
            
            total_co2e = submission.calculate_total_co2e()
            submission.total_co2e_value=total_co2e
            submission.save()
            print(total_co2e)
            return Response({
                'detail': f'Fuel consumption data for {month} {year} with fuel type "{fuel_type}" uploaded successfully.',
                'co2e_value': co2e_value , # Include CO2e value in response
                'total_co2e': total_co2e
            }, status=status.HTTP_201_CREATED)
            # return Response({
            #     'detail': f'Fuel consumption data for {month} {year} with fuel type "{fuel_type}" uploaded successfully.'
            # }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f"Error saving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class FuelConsumptionYearlyUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    EMISSION_FACTORS = {
        'Diesel': 4,  # kgCO2e per litre
        'Kerosene': 3,  # kgCO2e per litre
        'Propane': 2.5,  # kgCO2e per litre
        'Butane': 2.8,  # kgCO2e per litre
        'Petrol': 2,  # kgCO2e per litre
        'Coal': 2.2,  # kgCO2e per kg
        'Natural Gas': 2.5,  # kgCO2e per kg
        'Other': 3,  # Random emission factor
        'None': 0,  # No emissions
    }
    def post(self, request, *args, **kwargs):
        user = request.user
        year = request.data.get('year')
        file = request.FILES.get('file')
        fuel_type = request.data.get('fuel_type')
        consumption_quantity = request.data.get('consumption_quantity')
        consumption_unit = request.data.get('consumption_unit')

        # Validate inputs
        if not year or not fuel_type or not file or not consumption_quantity or not consumption_unit:
            return Response({
                'error': 'Year, fuel_type, consumption_quantity, consumption_unit, and file are required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Convert consumption_quantity to float
            consumption_quantity = float(consumption_quantity)
        except ValueError:
            return Response({
                'error': 'Consumption quantity must be a valid number.'
            }, status=status.HTTP_400_BAD_REQUEST)
        # valid_fuel_types = dict(FuelConsumption.FUEL_TYPES).keys()
        # valid_consumption_units = dict(FuelConsumption.CONSUMPTION_UNITS).keys()

        # if fuel_type not in valid_fuel_types:
        #     return Response({
        #         'error': f'Invalid fuel_type: {fuel_type}. Allowed values are: {list(valid_fuel_types)}.'
        #     }, status=status.HTTP_400_BAD_REQUEST)

        # if consumption_unit not in valid_consumption_units:
        #     return Response({
        #         'error': f'Invalid consumption_unit: {consumption_unit}. Allowed values are: {list(valid_consumption_units)}.'
        #     }, status=status.HTTP_400_BAD_REQUEST)

        
        
        # Ensure the year has not already been submitted
        user_submission = FuelConsumption.objects.filter(user=user, year=year).first()
        if user_submission and user_submission.has_submitted_monthly:
            return Response({"error": f"You have already uploaded monthly data for the year {year}."}, status=status.HTTP_400_BAD_REQUEST)
       
        # Validate the file extension
        file_extension = os.path.splitext(file.name)[1].lower()
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        if file_extension not in allowed_extensions:
            return Response({
                'error': 'Unsupported file type. Only PDF and image files are allowed.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Save the file
            file_name = f'{year}{file_extension}'
            file_path = f'FuelConsumption Yearly Bill/{user.id}/{file_name}'
            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
            print(f"File saved at {saved_file_path}")

            # Get or create the FuelConsumption record
            user_submission, created = FuelConsumption.objects.get_or_create(
                user=user,
                defaults={'year': year}
            )

            # Check if the year has changed and reset fuel data if so
            if user_submission.year != year:
                user_submission.fuel_data_yearly = {}  # Clear the fuel data for the new year
                user_submission.submitted_months = {}  # Clear submitted months
                user_submission.has_submitted_monthly = False

            # Check if the fuel type has already been submitted for the year
            if fuel_type in user_submission.fuel_data_yearly:
                return Response({
                    'error': f'Fuel type {fuel_type} already submitted for the year {year}.'
                }, status=status.HTTP_400_BAD_REQUEST)
            emission_factor = self.EMISSION_FACTORS.get(fuel_type, 0)  # Get the emission factor, default to 0 if not found
            co2e_value = (consumption_quantity * emission_factor) / 1000  # Convert to kgCO2e
            # total_co2e_value += co2e_value

            # Update the fuel data for the year
            fuel_data = user_submission.fuel_data_yearly
            fuel_data[fuel_type] = {
                'consumption_quantity': consumption_quantity,
                'consumption_unit': consumption_unit,
                'co2e_value': co2e_value
            }
            user_submission.fuel_data_yearly = fuel_data
            user_submission.has_submitted_yearly = True
            user_submission.year = year
            
            
            total_co2e_value = sum(fuel['co2e_value'] for fuel in fuel_data.values())
            user_submission.total_co2e_value=total_co2e_value
            user_submission.save()
            # return Response({
            #     'detail': f"Yearly data for {year} uploaded successfully."
            # }, status=status.HTTP_201_CREATED)
            
            # Return the calculated CO2e value without saving it
            return Response({
                'detail': f"Yearly data for {year} uploaded successfully.",
                'calculated_co2e': total_co2e_value
            }, status=status.HTTP_201_CREATED)

            # return Response({
            #     'detail': f"Yearly data for {year} uploaded successfully.",
            #     'total_co2e_yearly': total_co2e
            # }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': f"Error saving file: {e}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class FuelTypeChoicesAPIView(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]
#     def get(self, request, *args, **kwargs):
#         fuel_types = [
#             {'id': id, 'name': name} for id, name in FuelConsumption.FUEL_TYPES
#         ]
#         serializer = FuelTypeSerializer(fuel_types, many=True)
#         return Response(serializer.data)

# class ConsumptionUnitChoicesAPIView(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]
#     def get(self, request, *args, **kwargs):
#         consumption_units = [
#             {'id': id, 'name': name} for id, name in FuelConsumption.CONSUMPTION_UNITS
#         ]
#         serializer = ConsumptionUnitSerializer(consumption_units, many=True)
#         return Response(serializer.data)

########################################################################################################

# class GetVehiclesAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             vehicles = Vehicles.objects.filter(user=user, financial_year=request.data.get('financial_year'))
#             serializer = VehiclesSerializer(vehicles, many=True)
#             data = serializer.data
#             if len(data) > 0:
#                 return Response(data)
#             else:
#                 return Response("")
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class UploadVehicleAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             request.data['user'] = user.id
#             serializer = VehiclesSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=HTTP_200_OK)
#             else:
#                 return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class GetTransportAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             user_consumptions = Transport.objects.filter(user=user, financial_year=request.data.get('financial_year'))
#             serializer = TransportSerializer(user_consumptions, many=True)
#             data = serializer.data
#             if len(data) > 0:
#                 return Response(data)
#             else:
#                 return Response("")
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class UploadTransportAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             type = request.data.get('transport_type')
#             if request.data.get('consumption') == '':
#                 return Response({'consumption': 'consumption is needed'}, status=500)
#             if request.data.get('financial_year') == '':
#                 return Response({'financial_year': 'Financial Year is needed'}, status=500)
#             if type == '':
#                 return Response({'transport_type': 'Transport type is not supported'}, status=500)

#             existing_transport = Transport.objects.filter(user=user, transport_type=type,
#                                                           financial_year=request.data.get('financial_year'))
#             uploaded_files = request.FILES.getlist('files')
#             uploaded_files_list = []
#             for uploaded_file in uploaded_files:
#                 file_path = default_storage.save('transport/' + uploaded_file.name,
#                                                  ContentFile(uploaded_file.read()))
#                 uploaded_files_list.append(file_path)
#             if len(uploaded_files_list) == 0:
#                 return Response({'files': 'At-least one reference file should be attached'}, status=500)
#             if len(existing_transport) > 0:
#                 existing_transport.update(user=user, files_list=uploaded_files_list, transport_type=type,
#                                           financial_year=request.data.get('financial_year'),
#                                           consumption=request.data.get('consumption'))

#             else:
#                 attachments = Transport(user=user, files_list=uploaded_files_list, transport_type=type,
#                                         financial_year=request.data.get('financial_year'),
#                                         consumption=request.data.get('consumption'))
#                 attachments.save()
#             return Response({})
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class GetAdditionalFilesAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             user_consumptions = AdditionalFiles.objects.filter(user=user, file_type=request.data.get('data_type'),
#                                                                financial_year=request.data.get('financial_year'))
#             serializer = AdditionalFilesSerializer(user_consumptions, many=True)
#             data = serializer.data
#             if len(data) > 0:
#                 return Response(data)
#             else:
#                 return Response("")
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class GetDashboardAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             energy = EnergyConsumption.objects.filter(user=user, ).values_list('financial_year',
#                                                                                'consumption').order_by('financial_year')
#             fuel = FuelConsumption.objects.filter(user=user, ).values_list('financial_year').annotate(
#                 consumption_sum=Sum('consumption')).order_by('financial_year')
#             data = {
#                 "energy": [{
#                     "label": 'Energy Consumption',
#                     "data": list(energy)
#                 }],
#                 "fuel": [{
#                     "label": 'Fuel Consumption',
#                     "data": list(fuel)
#                 }]
#             }
#             return Response(data)
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class UploadAdditionalFilesAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             type = request.data.get('data_type')
#             if request.data.get('financial_year') == '':
#                 return Response({'financial_year': 'Financial Year is needed'}, status=500)
#             if type == '' or type not in ['supply_chain', 'finance']:
#                 return Response({'detail': 'Data type is not supported'}, status=500)

#             uploaded_files = request.FILES.getlist('files')
#             uploaded_files_list = []
#             for uploaded_file in uploaded_files:
#                 file_path = default_storage.save(type + '/' + uploaded_file.name,
#                                                  ContentFile(uploaded_file.read()))
#                 uploaded_files_list.append(file_path)
#             if len(uploaded_files_list) == 0:
#                 return Response({'files': 'At-least one reference file should be attached'}, status=500)
#             attachments = AdditionalFiles(user=user, files_list=uploaded_files_list, file_type=type,
#                                           financial_year=request.data.get('financial_year'))
#             attachments.save()
#             return Response({})
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class UploadSurveyQuestionsAPI(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             survey_questions = UserSurveyQuestions.objects.filter(user=user, )
#             if len(survey_questions) > 0:
#                 survey_questions.update(user=user, answers=request.data.get('answers'),
#                                         eligible=request.data.get('eligible'))
#             else:
#                 questions = UserSurveyQuestions(user=user, answers=request.data.get('answers'),
#                                                 eligible=request.data.get('eligible'))
#                 questions.save()
#             return Response({})
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


# class CheckCarbonCreditEligibility(knox_views.APIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes=[IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         user = request.auth.user if request.auth else None
#         if user:
#             survey_questions = UserSurveyQuestions.objects.filter(
#                 user=user,
#             )
#             if len(survey_questions) > 0:
#                 return Response({"completed": True, "eligible": survey_questions[0].eligible})
#             else:
#                 return Response({"completed": False})
#         else:
#             return Response({'detail': 'Token not valid or user not found'}, status=400)


##############Electricity Tab####################
########################################################################################################

class MonthUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        # electricity_value = None
        month = request.data.get('month')
        year = request.data.get('year')
        file = request.FILES.get('file')
        electricity_value = request.data.get('electricity_value')

        # Check if the user has already submitted yearly data for the given year
        if UserElectricitySubmission.objects.filter(user=user, year=year, has_submitted_yearly=True).exists():
            return Response({"error": "You have already uploaded yearly data for this year. Monthly data cannot be submitted."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate month and year choices
        month_choices = [choice[0] for choice in Months]
        if not month or month not in month_choices or not year:
            return Response({'detail': 'Invalid month or year choice.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file
        if not file:
            return Response({'detail': 'File is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate electricity value
        try:
            electricity_value = float(electricity_value)
            if electricity_value <= 0:
                return Response({'detail': 'Invalid electricity value. It should be a positive number.'}, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({'detail': 'Electricity value must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file extension
        file_extension = os.path.splitext(file.name)[1].lower()
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        if file_extension not in allowed_extensions:
            return Response({'error': 'Unsupported file type. Only PDF and image files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the file name and path for saving
            file_name = f'{month}_{year}{file_extension}'
            file_path = f'Electricity Monthly Bill/{user.id}/{file_name}'

            # Save the file to storage
            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
            print(saved_file_path)
            submission, created = UserElectricitySubmission.objects.get_or_create(
                user=user,
                defaults={'year': year}
                )
            if not created:
                # If the year is different from the stored year, reset submitted_months
                if submission.year != year:
                    print("Year is different, resetting months")
                    submission.submitted_months = {month: True}  # Start fresh for a new year
                    # submission.submitted_months = {}  # Clear previous month's data
                    submission.monthly_electricity_values = {}  # Clear previous values
                    submission.submitted_months[month] = {'electricity_value': electricity_value}
                    submission.monthly_electricity_values[month] = electricity_value
                    

                else:
                    # Add the new month if not already submitted
                    if month not in submission.submitted_months:
                        
                        submission.submitted_months[month] = True
                        
                        # submission.monthly_electricity_values[month] = electricity_value
                        

                # Update the submission details regardless of whether it was created or retrieved
                
                submission.monthly_electricity_values[month] = electricity_value
                submission.submitted_months[month] = {'electricity_value': electricity_value}
                submission.year = year
                submission.has_submitted_yearly = False
                submission.has_submitted_monthly = True
                submission.electricity_value=None

                # Mark the month as submitted
                submission.submitted_months[month] = True

                # Save the submission
                submission.save()
            else:
                submission.submitted_months[month] = True
                submission.monthly_electricity_values[month] = electricity_value
                # submission.submitted_months[month] = {'electricity_value': electricity_value}
                submission.year = year
                submission.has_submitted_yearly = False
                submission.has_submitted_monthly = True
                submission.electricity_value=None
                submission.save()
            
            total_monthly_electricity = sum(submission.monthly_electricity_values.values())
            print(total_monthly_electricity)
            # Calculate annual kWh and CO₂ emissions
            annual_kwh = total_monthly_electricity *1000  # kWh
            # emission_factor = 0.12  # kg CO₂e per kWh (example value)
            co2e_value = annual_kwh / 1000  # kg CO₂e
            submission.co2e_value=co2e_value
            submission.save()
            return Response({
                'detail': f'File for {month} {year} uploaded successfully with electricity value {electricity_value}.',
                'annual_kwh': annual_kwh,
                # 'co2e': co2e kg CO₂e,
                'co2e_value': f"{co2e_value} kg CO2e",
            }, status=status.HTTP_201_CREATED)
            # return Response({'detail': f'File for {month} {year} uploaded successfully with electricity value {electricity_value}.'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f"Error saving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class YearlyUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    # serializer_class = ElectricityDataSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        year = request.data.get('year')
        electricity_value = request.data.get('electricity_value')
        file = request.FILES.get('file')

        # Validate inputs
        if not year or not electricity_value or not file:
            return Response({'error': 'Year, electricity value, and file are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user_submission = UserElectricitySubmission.objects.filter(user=user, year=year).first()

        if user_submission and user_submission.has_submitted_yearly:
            return Response({"error": f"You have already uploaded yearly data for the year {year}."}, status=status.HTTP_400_BAD_REQUEST)
       
        if user_submission and any(user_submission.submitted_months.values()):
            return Response({"error": "You have already uploaded monthly data. Yearly data cannot be submitted."}, status=status.HTTP_400_BAD_REQUEST)

        if UserElectricitySubmission.objects.filter(user=user, year=year, has_submitted_monthly=True).exists():
            return Response({"error": "You have already uploaded monthly data for this year. Yearly data cannot be submitted."}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create the submission for the year
        user_submission, created = UserElectricitySubmission.objects.get_or_create(
            user=user,
           
            defaults={'has_submitted_yearly': True, 'electricity_value': electricity_value, 'year':year,}
        )

        if not created:
            # Update the existing submission to mark yearly data as submitted and store electricity value
            user_submission.year = year
            user_submission.has_submitted_yearly = True
            user_submission.has_submitted_monthly = False
            user_submission.submitted_months = {}  # Clear submitted months if uploading yearly
            user_submission.monthly_electricity_values = {} 
            user_submission.electricity_value = electricity_value
            user_submission.save()

        # Validate the file extension
        file_extension = os.path.splitext(file.name)[1].lower()
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        if file_extension not in allowed_extensions:
            return Response({'error': 'Unsupported file type. Only PDF and image files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save file to storage
            file_name = f'{year}{file_extension}'
            file_path = f'Electricity Yearly Bill/{user.id}/{file_name}'
            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
            print(f"File saved at {saved_file_path}")
            try:
                # Example: Annual kWh* 1000 (India conversion factor)
                annual_kwh = float(electricity_value) * 1000  # Assuming monthly value is given
                co2e_value = annual_kwh / 1000  # Convert to CO2 emissions in kg

                # You can store the result or trigger additional operations here
                # Example: Saving the CO2e value in the submission or another model
                user_submission.co2e_value = co2e_value
                user_submission.save()
                print(f"CO2e value saved: {user_submission.co2e_value}")

                # Return the response with the calculated CO2e value
                return Response({
                    'detail': f'Yearly file for {year} uploaded successfully.',
                    'electricity_value': electricity_value,
                    'annual_kwh': annual_kwh,
                    'co2e_value': f"{co2e_value} kg CO2e",
                    'file_path': saved_file_path
                }, status=status.HTTP_201_CREATED)
            except Exception as calculation_error:
                return Response({'error': f"Error performing calculation: {calculation_error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            # Return the response
            # return Response({
            #     'detail': f'Yearly file for {year} uploaded successfully.',
            #     'electricity_value': electricity_value,
            #     'file_path': saved_file_path
            # }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f"Error saving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MonthsChoicesAPIView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self, request, *args, **kwargs):
        serializer = MonthsSerializer(Months, many=True)
        return Response(serializer.data)


###########################################################################################################

class GetTransport(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self, request, *args, **kwargs):
        queryset = Transport.objects.all()
        serializer = TransportSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class YearlyTransportUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class = TransportDataSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        year = request.data.get('year')
        transports = request.data.get('transports')  # This should be a JSON string
        file = request.FILES.get('file')

        # Debug: Log the incoming data
        print(f'Received data: year={year}, transports={transports}, file={file}')

        if not file:
            return Response({'error': 'File is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not transports:
            return Response({'error': 'Transports data is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a submission for the same user and year already exists
        user_submission = UserTransportSubmission.objects.filter(user=user, year=year).first()
        if user_submission:
            if user_submission.has_submitted_monthly:
                return Response({"error": "You have already submitted monthly data for this year. Yearly data cannot be submitted."}, status=status.HTTP_400_BAD_REQUEST)
            if user_submission.has_submitted_yearly:
                return Response({"error": "You have already submitted yearly data for this year."}, status=status.HTTP_400_BAD_REQUEST)

        user_submission, created = UserTransportSubmission.objects.get_or_create(
            user=user,
            defaults={'year': year, 'has_submitted_yearly': True}
        )

        if not created:
            # Update the existing user submission to mark yearly data as submitted and update the year
            user_submission.year = year
            user_submission.has_submitted_yearly = True
            user_submission.has_submitted_monthly = False
            user_submission.submitted_months = {}
            user_submission.save()

        file_extension = os.path.splitext(file.name)[1].lower()
        allowed_extensions = ['.pdf', '.xlsx']

        if file_extension not in allowed_extensions:
            return Response({'error': 'Unsupported file type. Only PDF and excel files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create directory structure and construct file path
            file_name = f'{year}{file_extension}'
            file_path = f'Transport Yearly Bill/{user.id}/{file_name}'

            # Save file to storage
            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))

            # Parse transports JSON string
            try:
                transports_data = json.loads(transports)
            except json.JSONDecodeError as e:
                return Response({'error': f'Invalid JSON for transports data: {e}'}, status=status.HTTP_400_BAD_REQUEST)

            if not isinstance(transports_data, list):
                return Response({'error': 'Transports data must be a list of dictionaries.'}, status=status.HTTP_400_BAD_REQUEST)

            for transport_data in transports_data:
                print(f'Processing transport data: {transport_data}')  # Debug: Log each transport data
                Transport.objects.create(
                    user=user,
                    mode_of_transport=transport_data['mode_of_transport'],
                    distance_kms=transport_data['distance_kms'],
                    start_location=transport_data.get('start_location', ''),
                    end_location=transport_data.get('end_location', ''),
                    weight=transport_data['weight'],
                    weight_unit=transport_data['weight_unit'],
                    materials_being_shipped=transport_data.get('materials_being_shipped', ''),
                    submission=user_submission,  # Link to UserTransportSubmission
                    year=year
                )

            response_data = {'detail': f'File for {year} uploaded successfully.'}
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f"Error saving file: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class MonthlyTransportFileUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        year = request.data.get('year')
        print(year)
        month = request.data.get('month')
        transports = request.data.get('transports')  # This should be a JSON string
        file = request.FILES.get('file')

        # Debug: Log the incoming data
        print(f'Received data: year={year}, month={month}, transports={transports}, file={file}')
        if UserTransportSubmission.objects.filter(user=user, year=year, has_submitted_yearly=True).exists():
            return Response({"error": "You have already submitted yearly data for this year. Monthly data cannot be submitted."}, status=status.HTTP_400_BAD_REQUEST)
        if not file:
            return Response({'error': 'File is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not transports:
            return Response({'error': 'Transports data is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate month choice
        month_choices = [choice[0] for choice in Months]
        if not month or month not in month_choices or not year:
            return Response({'detail': 'Invalid month or year choice.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            existing_submission = UserTransportSubmission.objects.filter(user=user, year=year, submitted_months__has_key=month).first()

            if existing_submission:
                return Response({'error': f"You have already submitted data for {month} {year}. Monthly data cannot be submitted again."}, status=status.HTTP_400_BAD_REQUEST)
            # Check if there is an existing submission for the user
            user_submission = UserTransportSubmission.objects.filter(user=user).first()

            if user_submission:
                print(f"Existing submission found for user: {user.id}")
                print(f"Type of user_submission.year: {type(user_submission.year)}, Value: {user_submission.year}")
                print(f"Type of year: {type(year)}, Value: {year}")

                user_submission_year = user_submission.year
                year = str(year)

                if user_submission_year != year:
                    # If the year is different, clear the list of submitted months
                    print(f"Year changed from {user_submission_year} to {year}")
                    user_submission.submitted_months = {month: True}  # Set new month for the new year
                else:
                    print("Helloooooooo")
                    # If the year is the same, just add or update the new month in the existing submitted months
                    user_submission.submitted_months[month] = True
                
                # Update existing submission with new data
                user_submission.year = year
                user_submission.has_submitted_yearly=False
                user_submission.has_submitted_monthly = True
                user_submission.submitted_months[month] = True
                user_submission.save()
            else:
                print(f"Creating new submission for user: {user.id}")
                user_submission = UserTransportSubmission.objects.create(
                    user=user,
                    year=year,
                    has_submitted_yearly=False,
                    has_submitted_monthly=True,
                    submitted_months={month: True}
                )

            # Save file to storage
            file_extension = os.path.splitext(file.name)[1].lower()
            allowed_extensions = ['.pdf', '.xlsx']
            if file_extension not in allowed_extensions:
                return Response({'error': 'Unsupported file type. Only PDF and excel files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

            file_name = f'{year}{file_extension}'
            file_path = f'Transport Yearly Bill/{user.id}/{file_name}'

            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
            print(f"File saved at path: {saved_file_path}")

            # Parse transports JSON string
            transports_data = json.loads(transports)
            if not isinstance(transports_data, list):
                return Response({'error': 'Transports data must be a list of dictionaries.'}, status=status.HTTP_400_BAD_REQUEST)

            # Process each transport entry
            for transport_data in transports_data:
                # print(f'Processing transport data: {transport_data}')  # Debug: Log each transport data
                Transport.objects.create(
                    user=user,
                    mode_of_transport=transport_data['mode_of_transport'],
                    distance_kms=transport_data['distance_kms'],
                    start_location=transport_data.get('start_location', ''),
                    end_location=transport_data.get('end_location', ''),
                    weight=transport_data['weight'],
                    weight_unit=transport_data['weight_unit'],
                    materials_being_shipped=transport_data.get('materials_being_shipped', ''),
                    submission=user_submission,  # Link to UserTransportSubmission
                    month=month,  # Save month information
                    year=year
                )

            response_data = {'detail': f'Data for {month} {year} uploaded successfully.'}
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({'error': f"Error saving file or processing data: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TransportModesView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        data = {}
        serializer = TransportModesSerializer(data)
        return Response(serializer.data)

class WeightUnitsView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get(self, request):
        data = {}
        serializer = WeightUnitsSerializer(data)
        return Response(serializer.data)

class VehiclesUpload(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self, request, *args, **kwargs):
        vehicles = Vehicles.objects.all()
        serializer = GETVehiclesSerializer(vehicles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user = request.user
        vehicles = request.data.get('vehicles')  # This should be a list

        # Debug: Log the incoming data
        print(f'Received data: vehicles={vehicles}')

        if not vehicles:
            return Response({'error': 'vehicles data is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the data is a list
        if not isinstance(vehicles, list):
            return Response({'error': 'vehicles data must be a list of dictionaries.'}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = []
        for vehicle_data in vehicles:
            serializer = VehiclesSerializer(data=vehicle_data)
            if serializer.is_valid():
                validated_data.append(serializer.validated_data)
            else:
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Create Vehicles objects with the user field set manually
        vehicles_to_create = []
        for data in validated_data:
            vehicles_to_create.append(Vehicles(
                user=user,
                vehicle_type=data['vehicle_type'],
                number_of_vehicles=data['number_of_vehicles'],
                rto_number=data['rto_number']
            ))

        try:
            # Bulk create the vehicles
            Vehicles.objects.bulk_create(vehicles_to_create)
        except Exception as e:
            return Response({'error': f'Error creating vehicles: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Vehicles created successfully.'}, status=status.HTTP_201_CREATED)
        
class VehicleTypeListView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        print(request.user.id)
        vehicle_types = Vehicles.VEHICLE_TYPES
        serializer = VehicleTypeSerializer(vehicle_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)





class UploadSalesFinanceDataView(knox_views.APIView):
    def post(self, request):
        file = request.FILES.get('file')
        year = request.data.get('year')
        user = request.user
        print(file.name)
        if not file:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file extension
        file_extension = os.path.splitext(file.name)[1].lower()
        print(file_extension)
        allowed_extensions = ['.pdf', '.xls', '.xlsx', '.csv']
        if file_extension not in allowed_extensions:
            return Response({'error': 'Unsupported file type. Only PDF, XLS, and CSV files are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        # Construct file path and save file
        # file_name = f'{year}{file_extension}'
        # print(file_name)
        unique_id = uuid.uuid4().hex  # Generate a unique identifier
        file_name = f'{year}_{unique_id}{file_extension}'
        file_path = f'Sales and Finance/{user.id}/{file_name}'
        saved_file_path = default_storage.save(file_path , ContentFile(file.read()))
        print(f"File saved at path: {saved_file_path}")
        print(default_storage)
        existing_record = SalesFinanceData.objects.filter(user=user).first()

        if existing_record:
            # Update the existing record with the new year and file path
            existing_record.year = year
            existing_record.file_path = saved_file_path
            existing_record.save()
            return Response({'message': 'Record updated successfully and file saved.'}, status=status.HTTP_200_OK)
        else:
            # Create a new record
            data = {
                'user': user.id,
                'year': year,
                'file_path': saved_file_path
            }

        # Use serializer to save the data
        serializer = SalesFinanceDataSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'File uploaded successfully and metadata saved.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class SampleFileView(knox_views.APIView):
#     def get(self, request):
#         file_type = request.GET.get('type', 'csv').lower()

#         if file_type not in ['csv', 'xlsx']:
#             return Response({"error": "Invalid file type requested. Only 'csv' and 'xlsx' are supported."}, status=status.HTTP_400_BAD_REQUEST)

#         if file_type == 'csv':
#             file_name = 'sample_file.csv'
#             file_content = self.generate_csv()
#         else:
#             file_name = 'sample_file.xlsx'
#             file_content = self.generate_excel()

#         response = HttpResponse(file_content, content_type=self.get_content_type(file_type))
#         response['Content-Disposition'] = f'attachment; filename="{file_name}"'
#         return response

#     def generate_csv(self):
#         columns = ['Material Name', 'Weight', 'Weight Unit', 'Cost','Currency']
#         sample_df = pd.DataFrame(columns=columns)
#         buffer = BytesIO()
#         sample_df.to_csv(buffer, index=False)
#         buffer.seek(0)
#         return buffer.getvalue()

#     def generate_excel(self):
#         columns = ['Material Name', 'Weight', 'Weight Unit', 'Cost','Currency']
#         sample_df = pd.DataFrame(columns=columns)
#         buffer = BytesIO()
#         with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
#             sample_df.to_excel(writer, index=False, sheet_name='Sheet1')
#         buffer.seek(0)
#         return buffer.getvalue()

#     def get_content_type(self, file_type):
#         if file_type == 'csv':
#             return 'text/csv'
#         elif file_type == 'xlsx':
#             return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#         return 'application/octet-stream'



UNIT_MAPPING = {
    'kg': ['kg', 'kilogram', 'kgs', 'kilograms'],
    't': ['tonne', 'ton', 'metric ton', 'tons'],
    'g': ['g', 'gram', 'grams', 'gm']
}

def normalize_weight_unit(unit):
    unit = unit.strip().lower()
    for standard_unit, synonyms in UNIT_MAPPING.items():
        if any(synonym.lower() == unit for synonym in synonyms):
            return standard_unit
    return unit


MATERIALS = ["Steel", "Iron"]
class SupplyChainRawMaterialDataUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        name = data.get('name', '').strip().lower()
        weight = data.get('weight', '')
        weight_unit = data.get('weight_unit', '')
        cost = data.get('cost', '')
        currency = data.get('currency', 'inr').lower()  # default to 'inr' if not provided

        if not name or not weight or not weight_unit:
            return Response({"error": "Name, weight, and weight unit are required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Determine which API function to call based on the name
            if fuzz.partial_ratio(name, "steel") > 80:
                # api_response = call_climatiq_api_for_steel(name, weight, weight_unit)
                api_response = api_for_steel(name, weight, weight_unit)
            elif fuzz.partial_ratio(name, "iron") > 80:
                api_response = api_for_iron(name, cost, currency)
            else:
                return Response({"error": f"Material '{name}' is not supported"}, status=status.HTTP_400_BAD_REQUEST)

            if api_response:
                material_name = api_response.get("emission_factor", {}).get("name", "").lower()
                similarity = fuzz.partial_ratio(name, material_name)

                if similarity > 80:  # You can adjust the threshold
                    existing_entry = SupplyChainRawMaterial.objects.filter(
                        Q(material_name=material_name) &
                        Q(weight=weight) &
                        Q(weight_unit=weight_unit) &
                        Q(cost=cost) &
                        Q(currency=currency)
                    ).first()

                    if existing_entry:
                        return Response({"message": "This data has already added"}, status=status.HTTP_200_OK)
                    result = {
                        "user": request.user.id,
                        "material_name": material_name,
                        "weight": weight,
                        "weight_unit": weight_unit,
                        "cost": cost,
                        "currency": currency,  # Include currency in the result
                        "region": api_response.get("emission_factor", {}).get("region", ""),
                        "co2e": api_response.get("co2e", ""),
                        "co2e_unit": api_response.get("co2e_unit", "")
                    }

                    serializer = SupplyChainRawMaterialSerializer(data=result)
                    if serializer.is_valid():
                        serializer.save()
                        return Response({"message": "Data saved successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({"error": "Error saving data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"error": "Material name does not match sufficiently with API response"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Failed to retrieve data from Climatiq API"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SupplyChainRawMaterialFileUploadView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        file_name, file_extension = os.path.splitext(file.name)
        file_extension = file_extension.lower()

        if file_extension not in ['.csv', '.xls', '.xlsx']:
            return Response({"error": "Unsupported file format. Only CSV and Excel files are accepted."}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.is_authenticated:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = request.user.id
        unique_id = uuid.uuid4().hex
        file_name = f'{unique_id}{file_extension}'
        file_path = f'Supply Chain/{user_id}/{file_name}'

        try:
            saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
            print(f"File saved at: {saved_file_path}")

            if file_extension == '.csv':
                df = pd.read_csv(default_storage.path(file_path))
            elif file_extension in ['.xls', '.xlsx']:
                df = pd.read_excel(default_storage.path(file_path))

            print("Columns in dataframe:", df.columns)
            print(df.head())

            results = []
            messages = []
            for index, row in df.iterrows():
                name = row.get('Material Name', '').strip().lower()
                weight = row.get('Weight', '')
                weight_unit = normalize_weight_unit(row.get('Weight Unit', ''))
                cost = row.get('Cost', '')

                currency = row.get('Currency', '')
                if pd.isna(currency):
                    currency = 'inr'
                else:
                    currency = str(currency).lower()

                if fuzz.partial_ratio(name, "steel") > 80:
                    print(f"Matched as steel: {name}")
                    # api_response = call_climatiq_api_for_steel(name, weight, weight_unit)
                    api_response =api_for_steel(name, weight, weight_unit)
                elif fuzz.partial_ratio(name, "iron") > 80:
                    print(f"Matched as iron: {name}")
                    # api_response = call_climatiq_api_for_iron(name, cost, currency)
                    api_response =api_for_iron(name, cost, currency)
                else:
                    print(f"not match: {name}")
                    continue

                if api_response:
                    material_name = api_response.get("emission_factor", {}).get("name", "").lower()
                    similarity = fuzz.partial_ratio(name, material_name)
                    print(f"API Name: {material_name}, Similarity: {similarity}")

                    if similarity > 80:
                        existing_entry = SupplyChainRawMaterial.objects.filter(
                        Q(material_name=material_name) &
                        Q(weight=weight) &
                        Q(weight_unit=weight_unit) &
                        Q(cost=cost) &
                        Q(currency=currency)
                    ).first()

                        if existing_entry:
                            # print("already added")
                            print(f"Entry already exists for {material_name}")
                            messages.append(f"Data for {material_name} already exists.")
                            # return Response({"message": "This data has already added"}, status=status.HTTP_200_OK)
                            continue  
                        result = {
                            "user": request.user.id,
                            "material_name": material_name,
                            "weight": weight,
                            "weight_unit": weight_unit,
                            "cost": cost,
                            "currency": currency,
                            "region": api_response.get("emission_factor", {}).get("region", ""),
                            "co2e": api_response.get("co2e", ""),
                            "co2e_unit": api_response.get("co2e_unit", "")
                        }

                        print(f"Processed result: {result}")
                        serializer = SupplyChainRawMaterialSerializer(data=result)
                        if serializer.is_valid():
                            serializer.save()
                            print(f"Saved data: {result}")
                            messages.append(f"Data for {material_name} added successfully.")
                        else:
                            messages.append(f"Error saving data for {material_name}: {serializer.errors}")
                            continue
                            # print(f"Serialization error: {serializer.errors}")
                            # return Response({"error": "Error saving data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # return Response({"message": "File processed successfully", "data": results}, status=status.HTTP_200_OK)
            if messages:
                return Response({"messages": messages}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "data processed successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error processing file: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#sample climatiq Api
@csrf_exempt
def sample_climatiq_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            emission_factor = data.get('emission_factor', {})
            parameters = data.get('parameters', {})

            activity_id = emission_factor.get('activity_id', '')
            if 'weight' in parameters:
                # Sample response for steel (weight-based)
                if activity_id == 'metals-type_steel_production':
                    weight = parameters.get('weight', 0)
                    weight_unit = parameters.get('weight_unit', 'kg')
                    
                    # Hardcoded emission factor for steel (example value)
                    emission_factor_kg = 0.2  # kg CO2 per kg of steel
                    co2e = weight * emission_factor_kg
                    response_data = {
                        "co2e": round(co2e, 2),
                        "co2e_unit": "kg",
                        "co2e_calculation_method": "sample_method",
                        "co2e_calculation_origin": "sample_source",
                        "emission_factor": {
                            "name": "Steel production",
                            "activity_id": activity_id,
                            "id": "sample-id-steel",
                            "access_type": "public",
                            "source": "Sample Source",
                            "source_dataset": "Sample Dataset",
                            "year": 2023,
                            "region": "IN",
                            "category": "Metals",
                            "source_lca_activity": "cradle_to_gate",
                            "data_quality_flags": []
                        },
                        "constituent_gases": {
                            "co2e_total": round(co2e, 2),
                            "co2e_other": None,
                            "co2": round(co2e, 2),
                            "ch4": None,
                            "n2o": None
                        },
                        "activity_data": {
                            "activity_value": weight,
                            "activity_unit": weight_unit
                        },
                        "audit_trail": "selector"
                    }
                    return JsonResponse(response_data, status=200)

            elif 'money' in parameters:
                # Sample response for iron (cost-based)
                if activity_id == 'mined_materials-type_iron_ores':
                    cost = parameters.get('money', 0)
                    currency = parameters.get('money_unit', 'inr')

                    # Hardcoded emission factor for iron (example value)
                    emission_factor_kg_eur = 0.4832  # kg CO2 per EUR
                    exchange_rate = 80  # Example INR to EUR conversion rate
                    money_in_eur = cost / exchange_rate
                    co2e = money_in_eur * emission_factor_kg_eur
                    response_data = {
                        "co2e": round(co2e, 3),
                        "co2e_unit": "kg",
                        "co2e_calculation_method": "sample_method",
                        "co2e_calculation_origin": "sample_source",
                        "emission_factor": {
                            "name": "Iron ores",
                            "activity_id": activity_id,
                            "id": "sample-id-iron",
                            "access_type": "public",
                            "source": "Sample Source",
                            "source_dataset": "Sample Dataset",
                            "year": 2019,
                            "region": "IN",
                            "category": "Mined Materials",
                            "source_lca_activity": "unknown",
                            "data_quality_flags": []
                        },
                        "constituent_gases": {
                            "co2e_total": round(co2e, 3),
                            "co2e_other": None,
                            "co2": None,
                            "ch4": None,
                            "n2o": None
                        },
                        "activity_data": {
                            "activity_value": money_in_eur,
                            "activity_unit": "eur"
                        },
                        "audit_trail": "selector"
                    }
                    return JsonResponse(response_data, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)



def api_for_steel(name, weight, weight_unit):
    print("steel called.....")
    url = "http://localhost:8000/accounts/sample_climatiq_api/"
    data = {
        "emission_factor": {
            "activity_id": "metals-type_steel_production",
            "source": "Climate TRACE",
            "region": "IN",
            "source_lca_activity": "cradle_to_gate",
            "data_version": "^0"
        },
        "parameters": {
            "weight": weight,
            "weight_unit": weight_unit
        }
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"API request failed with status code {response.status_code}")
        return None

def api_for_iron(name, cost, currency):
    print("iron called.....")
    url = "http://localhost:8000/accounts/sample_climatiq_api/"
    data = {
        "emission_factor": {
            "activity_id": "mined_materials-type_iron_ores",
            "source": "EXIOBASE",
            "region": "IN",
            "source_lca_activity": "unknown",
            "data_version": "^0"
        },
        "parameters": {
            "money": cost,
            "money_unit": currency
        }
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"API request failed with status code {response.status_code}")
        return None


class EligibilityCheckAPI(knox_views.APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user
        data = request.data

        # Check if there's an existing record for this user
        eligibility_record, created = UserEligibility.objects.get_or_create(user=user)

        # Initialize or get attempts
        attempts = eligibility_record.attempts or {
            'industry': 0,
            'sub_sector': 0,
            'country': 0,
            'activity_performed': 0
        }
        max_attempts = 3

        # Define which questions are being updated based on the data received
        question_fields = {
            'industry': data.get('industry'),
            'sub_sector': data.get('sub_sector'),
            'country': data.get('country'),
            'activity_performed': data.get('activity_performed')
        }

        # Check if any question has exceeded the max attempts
        for field, value in question_fields.items():
            if value is not None and attempts.get(field, 0) >= max_attempts:
                return Response({
                    "message": f"You have exceeded the maximum attempts for the {field.replace('_', ' ')} question."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Update attempts for the provided fields
        for field, value in question_fields.items():
            if value is not None:
                attempts[field] += 1

        # Save the updated attempts
        eligibility_record.attempts = attempts
        eligibility_record.save()

        # Update the record with the new data
        serializer = UserEligibilitySerializer(eligibility_record, data=data, partial=True)
        if serializer.is_valid():
            industry = serializer.validated_data.get('industry')
            sub_sector = serializer.validated_data.get('sub_sector')
            country = serializer.validated_data.get('country')
            activity_performed = serializer.validated_data.get('activity_performed')
            data_available = serializer.validated_data.get('data_available', [])

            # Handle industry question
            if industry == 'none':
                serializer.save(eligible=False)
                return Response({
                    "message": "Although there is still a chance you might qualify for carbon credits, We at SustainCred will not be able to support you in this process. If anything related to your industry or business model changes, please refill the form again or contact us.",
                    "eligible": eligibility_record.eligible
                }, status=status.HTTP_200_OK)

            # Handle sub-sector question
            if sub_sector == 'none' and eligibility_record.eligible == True:
                serializer.save(eligible=False)
                return Response({
                    "message": "Although there is still a chance you might qualify for carbon credits, We at SustainCred will not be able to support you in this process. If anything related to your industry or business model changes, please refill the form again or contact us.",
                    "eligible": eligibility_record.eligible
                }, status=status.HTTP_200_OK)

            # Handle country question
            if country == 'developed_country':
                serializer.save(eligible=False)
                return Response({
                    "message": "Although there is still a chance you might qualify for carbon credits, We at SustainCred will not be able to support you in this process. If anything related to your industry or business model changes, please refill the form again or contact us.",
                    "eligible": eligibility_record.eligible
                }, status=status.HTTP_200_OK)

            # Handle activity_performed question
            if activity_performed in ['suppliers_to_renewables', 'distribution']:
                serializer.save(eligible=False)
                return Response({
                    "message": "Although there is still a chance you might qualify for carbon credits, We at SustainCred will not be able to support you in this process. If anything related to your industry or business model changes, please refill the form again or contact us.",
                    "eligible": eligibility_record.eligible
                }, status=status.HTTP_200_OK)

            # Data Available Check
            if data_available:
                print(data_available)
                required_keys = ['Electricity usage', 'Material used', 'Waste generated in operations', 'Transportation', 'Sale of products', 'Profit and loss statements','Chemical Alternatives']
                if any(key in data_available for key in required_keys):
                    serializer.save(eligible=True, data_available=data_available)
                    return Response({
                        "message": "You have successfully submitted the questionnaire. You are eligible for carbon credits. Please upload documents from my documents tab.",
                        "eligible": eligibility_record.eligible
                    }, status=status.HTTP_200_OK)
                else:
                    serializer.save(eligible=False, data_available=data_available)
                    return Response({
                        "message": "Not eligible",
                        "eligible": eligibility_record.eligible
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Final eligibility update
            eligibility_record = serializer.save(eligible=True)
            return Response({
                "message": "You are eligible for carbon credits. Please proceed with the next questions.",
                "eligible": eligibility_record.eligible
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class IndustryListView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        print(request.user.id)
        serializer = IndustrySerializer(INDUSTRY_CHOICES, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SubSectorListView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        print(request.user.id)
        serializer = SubSectorSerializer(SUB_SECTOR_CHOICES, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CountryListView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        print(request.user.id)
        serializer = CountrySerializer(COUNTRY, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ActivityPerformedListView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        print(request.user.id)
        serializer = ActivityPerformedSerializer(ACTIVITY_PERFORMED_CHOICES, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DataAvailableListView(knox_views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes=[IsAuthenticated]
   
    def get(self, request):
        print(request.user.id)
        serializer = DataAvailableSerializer(DATA_AVAILABLE_CHOICES, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddFileForQuestion(knox_views.APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user

        # Retrieve the existing eligibility record for the user
        try:
            eligibility_record = UserEligibility.objects.get(user=user)
        except UserEligibility.DoesNotExist:
            return Response({"message": "No eligibility record found for this user."}, status=status.HTTP_400_BAD_REQUEST)

        data_available = eligibility_record.data_available

        # Check which files are being uploaded
        allowed_keys = ['electricity_usage', 'material_used', 'waste_generated', 'transportation', 'profit_loss', 'chemical_alternatives']
        files_saved = []
        user_id = request.user.id

        for key in allowed_keys:
            if key in data_available and key in request.FILES:
                # Get the list of files for this key
                files = request.FILES.getlist(key)

                if len(files) > 3:
                    return Response({"message": f"Too many files uploaded for {key}. Maximum allowed is 12."}, status=status.HTTP_400_BAD_REQUEST)

                # Save each file
                for file in files:
                    file_path = f'{user_id}/{key}/{file.name}'
                    saved_file_path = default_storage.save(file_path, ContentFile(file.read()))
                    files_saved.append(saved_file_path)
                    print(saved_file_path)

        if not files_saved:
            return Response({"message": "No files to upload or none of the files correspond to selected options."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Files successfully uploaded.", "files": files_saved}, status=status.HTTP_200_OK)
    
    

class EndOfLifeProductAPIView(knox_views.APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        data = request.data
        user = request.user
        
        # Check if an entry already exists for the user
        try:
            end_of_life_product = EndOfLifeProduct.objects.get(user=user)
            # If entry exists, update it
            serializer = EndOfLifeProductSerializer(end_of_life_product, data=data, partial=True)  # 'partial=True' allows partial updates
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except EndOfLifeProduct.DoesNotExist:
            # If no entry exists, create a new one
            serializer = EndOfLifeProductSerializer(data=data)
            if serializer.is_valid():
                # Inject the user into the serializer before saving
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)









# my code
from rest_framework import permissions, viewsets
from . import models
from . import serializers
from django.core.exceptions import ObjectDoesNotExist
from . import custom_viewsets
from rest_framework.parsers import MultiPartParser, FormParser


class MonthsViewSet(viewsets.ModelViewSet):
  queryset = models.Months.objects.all()
  serializer_class = serializers.MonthsSerializer
  permission_classes = [permissions.IsAuthenticated]


class YearsViewSet(viewsets.ModelViewSet):
  queryset = models.Years.objects.all()
  serializer_class = serializers.YearsSerializer
  permission_classes = [permissions.IsAuthenticated]


# @api_view(['GET'])
# def co_ordinates(request):
#   if request.user.is_authenticated:
#     try:
#       country = request.user.profile.country
#       city = request.user.profile.city
#     except ObjectDoesNotExist:
#       return Response({'detail': 'User has no profile'}, status=status.HTTP_401_UNAUTHORIZED)    
#     if country and city:
#       query = {'city': city, 'country': country}
#       geo_locator = Nominatim(user_agent='my-app')
#       location = geo_locator.geocode(query)
#       if location:
#         lat, long = location.latitude, location.longitude
#         my_dict = {'city': city, 'country': country, 'latitude': lat, 'longitude': long}
#       else:
#         return Response({'detail': 'Cant find cordinates, please check country and city of user'}, status=status.HTTP_204_NO_CONTENT)
#       return Response(my_dict, status=status.HTTP_200_OK)
#     else:
#       return Response({'detail': 'No Country / City specified for the user'}, status=status.HTTP_204_NO_CONTENT)
#   return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)


class FuelMonthlyViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.FuelMonthly.objects.all()
  serializer_class = serializers.FuelMonthlySerializer
  authentication_classes = [TokenAuthentication]
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]  

  def get_queryset(self):
    return super().get_queryset().prefetch_related('files')
  
  def calculate_co2e(self):
    emission_factor = round(models.FUEL_DETAILS[self.fuel].emission_factor, 2)
    if self.consumption:
      co2e_kg = round(emission_factor * self.consumption, 2)
    else:
      co2e_kg = 0.0
    return co2e_kg
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.year = serializer.validated_data.get('year')
    self.consumption = serializer.validated_data.get('consumption')
    self.fuel = serializer.validated_data.get('fuel')
    self.user = self.request.user
    yearly_objects = models.FuelYearly.objects.filter(user=self.user, year=self.year)
    if not yearly_objects:
      co2e_kg = self.calculate_co2e()
      serializer.validated_data['co2e_kg'] = co2e_kg
      serializer.save(user=self.user)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response({'detail': 'Yearly data exists for selected year, So cannot upload monthly data'}, status=status.HTTP_403_FORBIDDEN)
    
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED) 
    

class FuelYearlyViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.FuelYearly.objects.all()
  serializer_class = serializers.FuelYearlySerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]  

  def get_queryset(self):
    return super().get_queryset().prefetch_related('files')
  
  def calculate_co2e(self):
    emission_factor = round(models.FUEL_DETAILS[self.fuel].emission_factor, 2)
    if self.consumption:
      co2e_kg = round(emission_factor * self.consumption, 2)
    else:
      co2e_kg = 0.0
    return co2e_kg
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.year = serializer.validated_data.get('year')
    self.consumption = serializer.validated_data.get('consumption')
    self.fuel = serializer.validated_data.get('fuel')
    self.user = self.request.user
    monthly_objects = models.FuelMonthly.objects.filter(user=self.user, year=self.year)
    if not monthly_objects:
      co2e_kg = self.calculate_co2e()
      serializer.validated_data['co2e_kg'] = co2e_kg
      serializer.save(user=self.user)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response({'detail': 'Monthly data exists for selected year, So cannot upload yearly data'}, status=status.HTTP_403_FORBIDDEN)
    
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED)


class EnergyMonthlyViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.EnergyMonthly.objects.all()
  serializer_class = serializers.EnergyMonthlySerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]  

  def get_queryset(self):
    return super().get_queryset().prefetch_related('files')
  
  def calculate_co2e(self):
    emission_factor = models.ENERGY_EMISSION_FACTOR
    if self.consumption:
      co2e_kg = round(emission_factor * self.consumption, 2)
    else:
      co2e_kg = 0.0
    return co2e_kg
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.year = serializer.validated_data.get('year')
    self.month = serializer.validated_data.get('month')
    self.consumption = serializer.validated_data.get('consumption')
    self.user = self.request.user
    objects = self.queryset.filter(user=self.user, year=self.year, month=self.month)
    yearly_objects = models.EnergyYearly.objects.filter(user=self.user, year=self.year)
    if not objects:
      if not yearly_objects:
        co2e_kg = self.calculate_co2e()
        serializer.validated_data['co2e_kg'] = co2e_kg
        serializer.save(user=self.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
      else:
        return Response({'detail': 'Yearly data exists for selected year, So cannot upload monthly data'}, status=status.HTTP_403_FORBIDDEN)
    else:
      return Response({'detail': 'Record exists for selected year and month, You must delete the record to upload new'}, status=status.HTTP_403_FORBIDDEN) 

  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED) 
    

class EnergyYearlyViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.EnergyYearly.objects.all()
  serializer_class = serializers.EnergyYearlySerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]  

  def get_queryset(self):
    return super().get_queryset().prefetch_related('files')
  
  def calculate_co2e(self):
    emission_factor = models.ENERGY_EMISSION_FACTOR
    if self.consumption:
      co2e_kg = round(emission_factor * self.consumption, 2)
    else:
      co2e_kg = 0.0
    return co2e_kg
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.year = serializer.validated_data.get('year')
    self.consumption = serializer.validated_data.get('consumption')
    self.user = self.request.user
    objects = self.queryset.filter(user=self.user, year=self.year)
    monthly_objects = models.EnergyMonthly.objects.filter(user=self.user, year=self.year)
    if not objects:
      if not monthly_objects:
        co2e_kg = self.calculate_co2e()
        serializer.validated_data['co2e_kg'] = co2e_kg
        serializer.save(user=self.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
      else:
        return Response({'detail': 'Monthly data exists for selected year, So cannot upload yearly data'}, status=status.HTTP_403_FORBIDDEN)
    else:
      return Response({'detail': 'Record exists for selected year, You must delete the record to upload new'}, status=status.HTTP_403_FORBIDDEN) 

  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED) 


class TransportMonthlyViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.TransportMonthly.objects.all()
  serializer_class = serializers.TransportMonthlySerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser] 

  def calculate_co2e(self):
    emission_factor = round(models.TRANSPORT_MODE_DETAILS[self.mode].emission_factor, 2)
    # ref_distance_unit = models.TRANSPORT_MODE_DETAILS[self.mode].unit.split(' ')[-1]
    # ref_weight_unit = models.TRANSPORT_MODE_DETAILS[self.mode].unit.split(' ')[-2]
    if self.distance and self.weight:
      if self.weight_unit.lower() == 'ton':
        co2e_kg = round(self.distance * self.weight * emission_factor, 2)
      elif self.weight_unit.lower() == 'kg':
        co2e_kg = round(self.distance * (self.weight/1000) * emission_factor, 2)
      else:
        return Response({'detail': f'Weight unit must be Kg or Ton'}, status=status.HTTP_400_BAD_REQUEST)
    else:
      co2e_kg = 0.0
    return co2e_kg
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.mode = serializer.validated_data.get('mode')
    self.year = serializer.validated_data.get('year')
    self.distance = serializer.validated_data.get('distance')
    self.weight = serializer.validated_data.get('weight')
    self.weight_unit = serializer.validated_data.get('weight_unit')
    self.user = self.request.user
    yearly_objects = models.TransportYearly.objects.filter(user=self.user, year=self.year)
    if not yearly_objects:
      co2e_kg = self.calculate_co2e()
      serializer.validated_data['co2e_kg'] = co2e_kg
      serializer.save(user=self.user)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response({'detail': 'Yearly data exists for selected year, So cannot upload monthly data'}, status=status.HTTP_403_FORBIDDEN)
    
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED) 


class TransportYearlyViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.TransportYearly.objects.all()
  serializer_class = serializers.TransportYearlySerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser] 

  def calculate_co2e(self):
    emission_factor = round(models.TRANSPORT_MODE_DETAILS[self.mode].emission_factor, 2)
    # ref_distance_unit = models.TRANSPORT_MODE_DETAILS[self.mode].unit.split(' ')[-1]
    # ref_weight_unit = models.TRANSPORT_MODE_DETAILS[self.mode].unit.split(' ')[-2]
    if self.distance and self.weight:
      if self.weight_unit.lower() == 'ton':
        co2e_kg = round(self.distance * self.weight * emission_factor, 2)
      elif self.weight_unit.lower() == 'kg':
        co2e_kg = round(self.distance * (self.weight/1000) * emission_factor, 2)
      else:
        return Response({'detail': f'Weight unit must be Kg or Ton'}, status=status.HTTP_400_BAD_REQUEST)
    else:
      co2e_kg = 0.0
    return co2e_kg
  
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.mode = serializer.validated_data.get('mode')
    self.year = serializer.validated_data.get('year')
    self.distance = serializer.validated_data.get('distance')
    self.weight = serializer.validated_data.get('weight')
    self.weight_unit = serializer.validated_data.get('weight_unit')
    self.user = self.request.user
    monthly_objects = models.TransportMonthly.objects.filter(user=self.user, year=self.year)
    if not monthly_objects:
      co2e_kg = self.calculate_co2e()
      serializer.validated_data['co2e_kg'] = co2e_kg
      serializer.save(user=self.user)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response({'detail': 'Monthly data exists for selected year, So cannot upload yearly data'}, status=status.HTTP_403_FORBIDDEN)
    
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED) 


class TransportMonthlyFilesViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.TransportMonthlyFiles.objects.all()
  serializer_class = serializers.TransportMonthlyFilesSerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]


  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    year = serializer.validated_data.get('year')
    user = self.request.user
    year_objects = models.TransportYearlyFiles.objects.filter(year=year, user=user)
    if not year_objects:
      serializer.save()
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
        return Response({'detail': 'Yearly data exists for selected year, So cannot upload monthly data'}, status=status.HTTP_403_FORBIDDEN)

  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    
class TransportYearlyFilesViewSet(custom_viewsets.CreateListRetrieveDeleteModelViewSet):
  queryset = models.TransportYearlyFiles.objects.all()
  serializer_class = serializers.TransportYearlyFilesSerializer
  permission_classes = [permissions.IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser]

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    year = serializer.validated_data.get('year')
    user = self.request.user
    month_objects = models.TransportMonthlyFiles.objects.filter(year=year, user=user)
    if not month_objects:
      serializer.save()
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
        return Response({'detail': 'Monthly data exists for selected year, So cannot upload yearly data'}, status=status.HTTP_403_FORBIDDEN)  
    
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    user = request.user
    if user:
      queryset = queryset.filter(user=user)
    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def destroy(self, request, *args, **kwargs):
    ref_object = self.get_object()
    self.year = ref_object.year
    self.user = self.request.user
    if ref_object.user == self.user:
      ref_object.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED)
