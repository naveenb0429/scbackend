from django.urls import path
from . import views, site_views
from . import dashboard_views
from knox.views import LogoutView, LogoutAllView


# my code start

from rest_framework.routers import DefaultRouter
from django.urls import path, include


router = DefaultRouter()
router.register(r'months', dashboard_views.MonthsViewSet, basename='month')
router.register(r'years', dashboard_views.YearsViewSet, basename='year')
router.register(r'fuel_monthly', dashboard_views.FuelMonthlyViewSet, basename='fuel_monthly')
router.register(r'fuel_yearly', dashboard_views.FuelYearlyViewSet, basename='fuel_yearly')
router.register(r'energy_monthly', dashboard_views.EnergyMonthlyViewSet, basename='energy_monthly')
router.register(r'energy_yearly', dashboard_views.EnergyYearlyViewSet, basename='energy_yearly')
router.register(r'transport_monthly', dashboard_views.TransportMonthlyViewSet, basename='transport_monthly')
router.register(r'transport_yearly', dashboard_views.TransportYearlyViewSet, basename='transport_yearly')
router.register(r'transport_monthly_files', dashboard_views.TransportMonthlyFilesViewSet, basename='transport_monthly_files')
router.register(r'transport_yearly_files', dashboard_views.TransportYearlyFilesViewSet, basename='transport_yearly_files')

# my code end


urlpatterns = [
    # Account Management
    path('create-user/', views.CreateUserAPI.as_view()),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
    path('resend-otp/', views.regenerate_otp, name='resend-otp'),
    path('update-user/<int:pk>/', views.UpdateUserAPI.as_view()),
    path('change-password/', views.ChangePasswordAPI.as_view()),
    path('reset-password/', views.ResetPasswordAPI.as_view()),
    path('login/', views.LoginAPIView.as_view()),

    path('logout/', LogoutView.as_view()),
    path('logout-all/', LogoutAllView.as_view()),
    # path('login-with-token/', views.login_with_token, name='login_with_token'),
    path('login-with-token/', views.LoginWithTokenView.as_view()),

    # Company CC Eligibility & Consumption
    # path('survey-questions/update/', dashboard_views.UploadSurveyQuestionsAPI.as_view()),
    # path('check-eligibility/', dashboard_views.CheckCarbonCreditEligibility.as_view()),
   

    #Fuel Consumption
    path('fuel-consumption/month-upload/', dashboard_views.FuelConsumptionMonthUploadView.as_view()),
    path('fuel-consumption/yearly-upload/', dashboard_views.FuelConsumptionYearlyUploadView.as_view()),
    # path('fuel-types/', dashboard_views.FuelTypeChoicesAPIView.as_view(), name='fuel_types'),
    # path('consumption-units/', dashboard_views.ConsumptionUnitChoicesAPIView.as_view(), name='consumption_units'),

    #Vehices Api
    path('vehicles/upload/', dashboard_views.VehiclesUpload.as_view()),
    path('vehicles/get/', dashboard_views.VehiclesUpload.as_view()),
    path('vehicle-types/', dashboard_views.VehicleTypeListView.as_view(), name='vehicle-type-list'),

    #Transport
    path('transportation/get/', dashboard_views.GetTransport.as_view()),
    path('transportation/', dashboard_views.YearlyTransportUploadView.as_view()),
    path('transportation/monthly-upload/', dashboard_views.MonthlyTransportFileUploadView.as_view()),
    path('transport-modes/',dashboard_views.TransportModesView.as_view(), name='transport-modes'),
    path('weight-units/', dashboard_views.WeightUnitsView.as_view(), name='weight-units'),

    # path('additional-details/update/', dashboard_views.UploadAdditionalFilesAPI.as_view()),
    # path('additional-details/get/', dashboard_views.GetAdditionalFilesAPI.as_view()),
    # path('dashboards/get/', dashboard_views.GetDashboardAPI.as_view()),

    # Miscellaneous site functions
    path('submit-enquiry/', site_views.SubmitEnquiry.as_view()),
    path('news-letter/', site_views.NewsLetter.as_view()),

    #Electricity Tab
    path('electricity-consumption-office/monthly_upload/', dashboard_views.MonthUploadView.as_view(), name='monthly-file-upload'),
    path('electricity-consumption-office/yearly_upload/', dashboard_views.YearlyUploadView.as_view(), name='yearly-upload'),
    path('months-choices/', dashboard_views.MonthsChoicesAPIView.as_view(), name='months-choices'),

    
    #SupplyChain
    path('supply-chain/raw-materials-data/', dashboard_views.SupplyChainRawMaterialDataUploadView.as_view(), name='upload_raw_materials_data'),
    path('supply-chain/raw-materials/', dashboard_views.SupplyChainRawMaterialFileUploadView.as_view(), name='upload_raw_materials'),

    #sample climatiq api
    path('sample_climatiq_api/',  dashboard_views.sample_climatiq_api, name='sample_climatiq_api'),
    path('upload-sales-finance/', dashboard_views.UploadSalesFinanceDataView.as_view(), name='upload-sales-finance'),
    
    #questionnaire
    path('submit-questionnaire/', dashboard_views.EligibilityCheckAPI.as_view(), name='submit-questionnaire'),
    path('industry/', dashboard_views.IndustryListView.as_view(), name='industry-choices'),
    path('sub-sector/', dashboard_views.SubSectorListView.as_view(), name='subsector-choices'),
    path('country/', dashboard_views.CountryListView.as_view(), name='country-choices'),
    path('activity-performed/', dashboard_views.ActivityPerformedListView.as_view(), name='activity-performed-choices'),
    path('data-available/', dashboard_views.DataAvailableListView.as_view(), name='data-available'),
    path('file-upload-question/', dashboard_views.AddFileForQuestion.as_view(), name='file-upload'),
    
    #End of life product
    path('end-of-life-products/', dashboard_views.EndOfLifeProductAPIView.as_view(), name='end-of-life-products-create'),
    
    

    # my code
    path('', include(router.urls)),




]
