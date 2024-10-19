import random
from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import serializers
from .models import UserProfile, EnergyConsumption, FuelConsumption, Vehicles, Transport, AdditionalFiles, NewsLetter, \
    UserSurveyQuestions,Transport, UserTransportSubmission,SupplyChainRawMaterial,SalesFinanceData,UserEligibility,EndOfLifeProduct
from django.contrib.auth import authenticate
from django.conf import settings
from .choices import DATA_AVAILABLE_CHOICES
from .utils import send_email_otp


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'email', 'first_name')
        


class SurveyQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSurveyQuestions
        fields = '__all__'


class EnergyConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyConsumption
        fields = '__all__'

class FuelConsumptionSerializer(serializers.ModelSerializer):
    file = serializers.FileField(allow_empty_file=False, write_only=True)

    class Meta:
        model = FuelConsumption
        fields = ['fuel_type', 'consumption_quantity', 'consumption_unit', 'year', 'file']
        read_only_fields = ['user']

class FuelTypeSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()

class ConsumptionUnitSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()

class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = '__all__'


class AdditionalFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalFiles
        fields = '__all__'


class BasicValidations(serializers.ModelSerializer):
    email = serializers.EmailField()
    location = serializers.CharField(
        required=False,
        max_length=100
    )
    password = serializers.CharField(
        write_only=True,
        min_length=settings.MIN_PASSWORD_LENGTH,
        error_messages={
            "min_length": "Password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        },
    )
    first_name = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=30,
        error_messages={
            "min_length": "First Name must be longer than 3 characters",
            "max_length": "First Name must be longer than 30 characters"
        },
    )
    last_name = serializers.CharField(
        write_only=True,
        max_length=30,
        error_messages={
            "max_length": "Last Name must be longer than 30 characters"
        },
    )
    company = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=50,
        error_messages={
            "min_length": "Company must be longer than 3 characters",
            "max_length": "Company must be longer than 50 characters"
        },
    )
    job_role = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=50,
        error_messages={
            "min_length": "Job role must be longer than 3 characters",
            "max_length": "Job Role must be longer than 50 characters"
        },
    )

    phone_number = serializers.RegexField(regex=r"^\d{10}", required=True)

    def __init__(self, *args, **kwargs):
        super(BasicValidations, self).__init__(*args, **kwargs)
        self.fields['phone_number'].error_messages['required'] = 'Please enter phone number.'
        self.fields['phone_number'].error_messages['invalid'] = 'Please enter a phone number with 10 digits.'


class CreateUserSerializer(BasicValidations, serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            "id",
            "email",
            "password",
            "first_name",
            "phone_number",
            "last_name",
            "company",
            "location",
            "job_role",
            "city",
            "country",
            "zip_code",
            "region",
            "industry_type"
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        if UserProfile.objects.filter(email=email).exists():
            raise serializers.ValidationError('User with this email id already exists.')
        return attrs

    def create(self, validated_data):
        otp = random.randint(1000, 99999)
        otp_expiry = datetime.now() + timedelta(minutes=2, seconds=30)

        user = UserProfile(
            email=validated_data["email"],
            otp=otp,
            otp_expiry=otp_expiry,
            max_otp_try=settings.MAX_OTP_TRY,
            gender=4,
            phone_number=validated_data["phone_number"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            address='',
            location=validated_data["location"],
            company=validated_data["company"],
            job_role=validated_data["job_role"],
            city=validated_data["city"],
            country=validated_data["country"],
            zip_code=validated_data["zip_code"],
            region=validated_data["region"],
            industry_type=validated_data["industry_type"]
        )
        user.set_password(validated_data["password"])
        user.save()
        send_email_otp(validated_data["email"], otp)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    reset = serializers.BooleanField(required=False)
    new_password = serializers.CharField(
        write_only=True,
        min_length=settings.MIN_PASSWORD_LENGTH,
        error_messages={
            "min_length": "Password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        },
    )


class UpdateUserSerializer(BasicValidations, serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('first_name',
                  'last_name',
                  'phone_number',
                  'email',
                  "company",
                  "job_role")

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        return instance


class EnquirySerializer(serializers.Serializer):
    companyName = serializers.CharField(min_length=3, max_length=50)
    email = serializers.EmailField(min_length=3, max_length=50)
    enquiry = serializers.CharField(min_length=10, max_length=500)
    firstName = serializers.CharField(min_length=3, max_length=50)
    lastName = serializers.CharField(max_length=50)
    phoneNumber = serializers.IntegerField()


class NewsLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsLetter
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    temporary_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=True, required=False)

    def validate(self, attrs):
        email = attrs.get('email').lower()
        password = attrs.get('password')
        temporary_password = attrs.get('temporary_password')

        if not email or not password:
            raise serializers.ValidationError("Please give both email and password.")

        userQuery = UserProfile.objects.filter(email=email)
        if not userQuery.exists():
            raise serializers.ValidationError('Email does not exist.')

        if temporary_password is not None and len(temporary_password)>0:
            user = userQuery.first()
            if not user.temporary_password == temporary_password:
                raise serializers.ValidationError("Incorrect Credentials.")
            if timezone.now() > user.otp_expiry:
                raise serializers.ValidationError("Temporary Password Credentials Expired.")
        else:
            user = authenticate(request=self.context.get('request'), email=email,
                            password=password)

        if not user:
            raise serializers.ValidationError("Wrong Credentials.")

        attrs['user'] = user
        return attrs



class MonthsSerializer(serializers.Serializer):
    id = serializers.CharField(source='name')  # Assuming 'name' as the unique identifier
    name = serializers.CharField()

    def to_representation(self, instance):
        return {
            'id': instance[0],   # Assuming the first element of the tuple is the identifier
            'name': instance[1]  # Assuming the second element of the tuple is the name
        }
    


class TransportDataSerializer(serializers.ModelSerializer):
    # transport_modes = TransportModeSerializer(many=True)

    class Meta:
        model = Transport
        fields = [
            'transport_modes',
            'distance_kms',
            'start_location',
            'end_location',
            'weight',
            'weight_unit',
            'materials_being_shipped'
        ]
        read_only_fields = ['user']

    


class UserTransportSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTransportSubmission
        fields = ('id','user')

class TransportSerializer(serializers.ModelSerializer):
    submission = UserTransportSubmissionSerializer()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Transport
        fields = ('id', 'user', 'month','year','mode_of_transport', 'distance_kms', 'start_location', 'end_location',
                  'weight', 'weight_unit', 'materials_being_shipped', 'submission')


class TransportModesSerializer(serializers.Serializer):
    transport_modes = serializers.SerializerMethodField()

    def get_transport_modes(self, obj):
        return [{'id': mode[0].lower(), 'name': mode[1]} for mode in Transport.TRANSPORT_MODES]

class WeightUnitsSerializer(serializers.Serializer):
    weight_units = serializers.SerializerMethodField()

    def get_weight_units(self, obj):
        return [{'id': unit[0].lower(), 'name': unit[1]} for unit in Transport.WEIGHT_UNITS]

class VehiclesSerializer(serializers.ModelSerializer):
    def validate_rto_number(self, value):
        if not (5 <= len(value) <= 14):
            raise serializers.ValidationError("RTO number must be between 5 and 14 characters long.")
        return value
    
    def validate(self, data):
        # Ensure all vehicles in the list are valid
        if isinstance(data, list):
            for item in data:
                # Validate each vehicle entry
                self.validate_rto_number(item.get('rto_number'))
        return data
    class Meta:
        model = Vehicles
        fields = ['id', 'vehicle_type', 'number_of_vehicles', 'rto_number', 'update_time']
        read_only_fields = ['user']


class GETVehiclesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Vehicles
        fields = ['id', 'user','vehicle_type', 'number_of_vehicles', 'rto_number', 'update_time']

class VehicleTypeSerializer(serializers.Serializer):
    id = serializers.CharField(source='value')
    name = serializers.CharField(source='display_name')

    def to_representation(self, instance):
        # Convert tuple (value, display_name) to dict with id and name
        return {
            'id': instance[0],
            'name': instance[1]
        }
       

class Q1SupplyChainRawMaterialSerializer(serializers.ModelSerializer):
    # user = serializers.ReadOnlyField(source='user.email')  # Adjust to whatever user field you want to expose
    # user = serializers.ReadOnlyField()
    class Meta:
        model = SupplyChainRawMaterial
        fields = ['user','material_name', 'quantity', 'unit', 'cost','country_region']  # Include 'user' as read-only
        read_only_fields = ['user']

class SupplyChainRawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplyChainRawMaterial
        fields = [
            'user',
            'material_name',
            'weight',
            'weight_unit',
            'cost',
            'region',
            'co2e',
            'co2e_unit',
            'currency',
            'created_at',
        ]
class SalesFinanceDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesFinanceData
        fields = ['user', 'year', 'uploaded_at']
        
   
class UserEligibilitySerializer(serializers.ModelSerializer):
    data_available = serializers.ListField(
        child=serializers.ChoiceField(choices=DATA_AVAILABLE_CHOICES),
        allow_empty=True,
        required=False
    )
    class Meta:
        model = UserEligibility
        fields = '__all__'
        
class IndustrySerializer(serializers.Serializer):
    id = serializers.CharField(source='value')
    name = serializers.CharField(source='display_name')

    def to_representation(self, instance):
        # Convert tuple (value, display_name) to dict with id and name
        return {
            'id': instance[0],
            'name': instance[1]
        }
        
class SubSectorSerializer(serializers.Serializer):
    id = serializers.CharField(source='value')
    name = serializers.CharField(source='display_name')

    def to_representation(self, instance):
        # Convert tuple (value, display_name) to dict with id and name
        return {
            'id': instance[0],
            'name': instance[1]
        }
        

class CountrySerializer(serializers.Serializer):
    id = serializers.CharField(source='value')
    name = serializers.CharField(source='display_name')

    def to_representation(self, instance):
        # Convert tuple (value, display_name) to dict with id and name
        return {
            'id': instance[0],
            'name': instance[1]
        }
    
    
class ActivityPerformedSerializer(serializers.Serializer):
    id = serializers.CharField(source='value')
    name = serializers.CharField(source='display_name')

    def to_representation(self, instance):
        # Convert tuple (value, display_name) to dict with id and name
        return {
            'id': instance[0],
            'name': instance[1]
        }
        
class DataAvailableSerializer(serializers.Serializer):
    id = serializers.CharField(source='value')
    name = serializers.CharField(source='display_name')

    def to_representation(self, instance):
        # Convert tuple (value, display_name) to dict with id and name
        return {
            'id': instance[0],
            'name': instance[1]
        }
        
        
class EndOfLifeProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = EndOfLifeProduct
        fields = ['id', 'product_name', 'weight_kg', 'disposal_method', 'created_at']
        read_only_fields = ['id', 'created_at']







# my code
from . import models
import os
from collections import Counter


class YearsSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Years
    fields = '__all__'


class MonthsSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Months
    fields = '__all__'


class FuelMonthlyFileSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.FuelMonthlyFile
    fields = ['id', 'fuel_monthly', 'file']


class FuelMonthlySerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  files = FuelMonthlyFileSerializer(many=True, read_only=True)
  uploaded_files = serializers.ListField(
    child=serializers.FileField(allow_empty_file=False, use_url=False),
    write_only=True
  )
  co2e_kg = serializers.ReadOnlyField()

  class Meta:
    model = models.FuelMonthly
    fields = ["id", "fuel", "year", "month", "consumption", "unit", "user", 'co2e_kg', "files", "uploaded_files"]

  def validate_uploaded_files(self, value):
    allowed_ext = ['.pdf', '.jpg', '.xlsx']
    for file in value:
      ext = os.path.splitext(file.name)[-1]
      if ext not in allowed_ext:
        raise serializers.ValidationError(f'{ext} file not allowed. Please select {allowed_ext}')
    return value

  def create(self, validated_data):
    uploaded_files = validated_data.pop("uploaded_files")
    year = validated_data['year']
    month = validated_data['month']
    fuel = validated_data['fuel']
    user = self.context['request'].user
    validated_data['user'] = user

    fuel_monthly = models.FuelMonthly.objects.create(**validated_data)

    ext_list = []

    for file in uploaded_files:
      # Generate new filename
      base_name = os.path.basename(file.name)
      org_file_name, ext = os.path.splitext(base_name)
      ext_list.append(ext)
      ext_count_dict = Counter(ext_list)
      count = ext_count_dict[ext]
      cur_time = timezone.now()
      formatted_cur_time = cur_time.strftime('%b_%d_%Y_%H_%M_%S')
      new_file_name = f'{year}_{month}_{fuel}_{formatted_cur_time}_v{count}_{org_file_name}{ext}'
      file.name = new_file_name
      validated_data['file'] = file
      models.FuelMonthlyFile.objects.create(fuel_monthly=fuel_monthly, file=file)
    return fuel_monthly
  

class FuelYearlyFileSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.FuelYearlyFile
    fields = ['id', 'fuel_yearly', 'file']


class FuelYearlySerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  files = FuelYearlyFileSerializer(many=True, read_only=True)
  uploaded_files = serializers.ListField(
    child=serializers.FileField(allow_empty_file=False, use_url=False),
    write_only=True
  )
  co2e_kg = serializers.ReadOnlyField()

  class Meta:
    model = models.FuelYearly
    fields = ["id", "fuel", "year", "consumption", "unit", "user", 'co2e_kg', "files", "uploaded_files"]

  def validate_uploaded_files(self, value):
    allowed_ext = ['pdf', 'jpg', 'xlsx']
    for file in value:
      ext = os.path.splitext(file.name)[-1][1:]
      if ext not in allowed_ext:
        raise serializers.ValidationError(f'{ext} file not allowed. Please select {allowed_ext}')
    return value

  def create(self, validated_data):
    uploaded_files = validated_data.pop("uploaded_files")
    year = validated_data['year']
    fuel = validated_data['fuel']
    user = self.context['request'].user
    validated_data['user'] = user

    fuel_yearly = models.FuelYearly.objects.create(**validated_data)

    ext_list = []

    for file in uploaded_files:
      # Generate new filename
      ext = os.path.splitext(file.name)[-1]
      ext_list.append(ext)
      ext_count_dict = Counter(ext_list)
      count = ext_count_dict[ext]
      cur_time = timezone.now()
      formatted_cur_time = cur_time.strftime('%b_%d_%Y_%H_%M_%S')
      new_file_name = f'{year}_{fuel}_{formatted_cur_time}_v{count}{ext}'
      file.name = new_file_name
      validated_data['file'] = file
      models.FuelYearlyFile.objects.create(fuel_yearly=fuel_yearly, file=file)
    return fuel_yearly
  

class EnergyMonthlyFileSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.EnergyMonthlyFile
    fields = ['id', 'energy_monthly', 'file']


class EnergyMonthlySerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  files = EnergyMonthlyFileSerializer(many=True, read_only=True)
  uploaded_files = serializers.ListField(
    child=serializers.FileField(allow_empty_file=False, use_url=False),
    write_only=True
  )
  co2e_kg = serializers.ReadOnlyField()

  class Meta:
    model = models.EnergyMonthly
    fields = ["id", "year", "month", "consumption", "user", 'co2e_kg', "files", "uploaded_files"]

  def validate_uploaded_files(self, value):
    print(value)
    allowed_ext = ['pdf', 'jpg', 'xlsx']
    for file in value:
      ext = os.path.splitext(file.name)[-1][1:]
      print(ext)
      if ext not in allowed_ext:
        raise serializers.ValidationError(f'{ext} file not allowed. Please select {allowed_ext}')
    return value

  def create(self, validated_data):
    uploaded_files = validated_data.pop("uploaded_files")
    year = validated_data['year']
    month = validated_data['month']
    user = self.context['request'].user
    validated_data['user'] = user

    energy_monthly = models.EnergyMonthly.objects.create(**validated_data)

    ext_list = []

    for file in uploaded_files:
      # Generate new filename
      ext = os.path.splitext(file.name)[-1]
      ext_list.append(ext)
      ext_count_dict = Counter(ext_list)
      count = ext_count_dict[ext]
      cur_time = timezone.now()
      formatted_cur_time = cur_time.strftime('%b_%d_%Y_%H_%M_%S')
      new_file_name = f'{year}_{month}_Energy_{formatted_cur_time}_v{count}{ext}'
      file.name = new_file_name
      validated_data['file'] = file
      models.EnergyMonthlyFile.objects.create(energy_monthly=energy_monthly, file=file)
    return energy_monthly
  

class EnergyYearlyFilesSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.EnergyYearlyFile
    fields = ['id', 'energy_yearly', 'file']


class EnergyYearlySerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  files = EnergyYearlyFilesSerializer(many=True, read_only=True)
  uploaded_files = serializers.ListField(
    child=serializers.FileField(allow_empty_file=False, use_url=False),
    write_only=True
  )
  co2e_kg = serializers.ReadOnlyField()

  class Meta:
    model = models.EnergyYearly
    fields = ["id", "year", "consumption", "user", 'co2e_kg', "files", "uploaded_files"]

  def validate_uploaded_files(self, value):
    allowed_ext = ['pdf', 'jpg', 'xlsx']
    for file in value:
      ext = os.path.splitext(file.name)[-1][1:]
      if ext not in allowed_ext:
        raise serializers.ValidationError(f'{ext} file not allowed. Please select {allowed_ext}')
    return value

  def create(self, validated_data):
    uploaded_files = validated_data.pop("uploaded_files")
    year = validated_data['year']
    user = self.context['request'].user
    validated_data['user'] = user

    energy_yearly = models.EnergyYearly.objects.create(**validated_data)

    ext_list = []

    for file in uploaded_files:
      # Generate new filename
      ext = os.path.splitext(file.name)[-1]
      ext_list.append(ext)
      ext_count_dict = Counter(ext_list)
      count = ext_count_dict[ext]
      cur_time = timezone.now()
      formatted_cur_time = cur_time.strftime('%b_%d_%Y_%H_%M_%S')
      new_file_name = f'{year}_Energy_{formatted_cur_time}_v{count}{ext}'
      file.name = new_file_name
      validated_data['file'] = file
      models.EnergyYearlyFile.objects.create(energy_yearly=energy_yearly, file=file)
    return energy_yearly


class TransportMonthlySerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  co2e_kg = serializers.ReadOnlyField()

  class Meta:
    model = models.TransportMonthly
    fields = ["id", "mode", "year", "month", "distance", "distance_unit", "weight", "weight_unit", 
              "start", "end", "materials", "user", 'co2e_kg']


class TransportYearlySerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  co2e_kg = serializers.ReadOnlyField()

  class Meta:
    model = models.TransportYearly
    fields = ["id", "mode", "year", "distance", "distance_unit", "weight", "weight_unit", 
              "start", "end", "materials", "user", 'co2e_kg']
    

class TransportMonthlyFilesSerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  file = serializers.ReadOnlyField(source='file.name')
  uploaded_files = serializers.ListField(
    child=serializers.FileField(allow_empty_file=False, use_url=False),
    write_only=True
  )

  class Meta:
    model = models.TransportMonthlyFiles
    fields = ['id', 'year', 'month', 'user', 'uploaded_files', 'file']

  def validate_uploaded_files(self, value):
    allowed_ext = ['pdf', 'jpg', 'xlsx']
    for file in value:
      ext = os.path.splitext(file.name)[-1][1:]
      if ext not in allowed_ext:
        raise serializers.ValidationError(f'{ext} file not allowed. Please select {allowed_ext}')
    return value
  

  def create(self, validated_data):
    uploaded_files = validated_data.pop("uploaded_files")
    year = validated_data['year']
    month = validated_data['month']
    user = self.context['request'].user
    validated_data['user'] = user

    ext_list = []

    for file in uploaded_files:
      # Generate new filename
      ext = os.path.splitext(file.name)[-1]
      ext_list.append(ext)
      ext_count_dict = Counter(ext_list)
      count = ext_count_dict[ext]
      cur_time = timezone.now()
      formatted_cur_time = cur_time.strftime('%b_%d_%Y_%H_%M_%S_%f')
      new_file_name = f'{year}_{month}_Transport_{formatted_cur_time}_v{count}{ext}'
      file.name = new_file_name
      validated_data['file'] = file
      # yearly_objects = models.TransportYearlyFiles.objects.filter(user=user, year=year)
      # if not yearly_objects:
      tr_fie_obj = models.TransportMonthlyFiles.objects.create(**validated_data)
      # else:
    return tr_fie_obj
  

class TransportYearlyFilesSerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.email')
  file = serializers.ReadOnlyField(source='file.name')
  uploaded_files = serializers.ListField(
    child=serializers.FileField(allow_empty_file=False, use_url=False),
    write_only=True
  )

  class Meta:
    model = models.TransportYearlyFiles
    fields = ['id', 'year', 'user', 'uploaded_files', 'file']

  def validate_uploaded_files(self, value):
    allowed_ext = ['pdf', 'jpg', 'xlsx']
    for file in value:
      ext = os.path.splitext(file.name)[-1][1:]
      if ext not in allowed_ext:
        raise serializers.ValidationError(f'{ext} file not allowed. Please select {allowed_ext}')
    return value
  

  def create(self, validated_data):
    uploaded_files = validated_data.pop("uploaded_files")
    year = validated_data['year']
    user = self.context['request'].user
    validated_data['user'] = user

    ext_list = []

    for file in uploaded_files:
      # Generate new filename
      ext = os.path.splitext(file.name)[-1]
      ext_list.append(ext)
      ext_count_dict = Counter(ext_list)
      count = ext_count_dict[ext]
      cur_time = timezone.now()
      formatted_cur_time = cur_time.strftime('%b_%d_%Y_%H_%M_%S_%f')
      new_file_name = f'{year}__Transport_{formatted_cur_time}_v{count}{ext}'
      file.name = new_file_name
      validated_data['file'] = file
      tr_fie_obj = models.TransportYearlyFiles.objects.create(**validated_data)
    return tr_fie_obj