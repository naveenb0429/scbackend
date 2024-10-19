import json
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.exceptions import ValidationError
from django.core.validators import validate_email, MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.timezone import now
# from .choices import Months ,COUNTRY_CHOICES
from .choices import Months,COUNTRY_CHOICES,INDUSTRY_CHOICES,SUB_SECTOR_CHOICES,COUNTRY,ACTIVITY_PERFORMED_CHOICES,DATA_AVAILABLE_CHOICES

# my imports





def validate_vehicle(value):
    vehicle_choices = ["Sedan", "SUV", "Truck"]
    if value not in vehicle_choices:
        raise ValidationError(f"{value} is not a supported value.")


def validate_transport(value):
    transport_choices = ["Air", "Water", "Rail", "Road"]
    if value not in transport_choices:
        raise ValidationError(f"{value} is not a supported value.")


def validate_file_type(value):
    file_type = ["supply_chain", "finance"]
    if value not in file_type:
        raise ValidationError(f"{value} is not a supported value.")


class UserManager(BaseUserManager):

    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have a email")
        user = self.model(email=email)
        user.gender = 4
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email=email, password=password
        )
        user.gender = 4
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class UserProfile(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        (1, 'male'),
        (2, 'female'),
        (3, 'other'),
        (4, 'null')
    )
    email = models.EmailField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
        validators=[validate_email],
    )
    otp = models.CharField(max_length=6)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    max_otp_try = models.CharField(max_length=2, default=settings.MAX_OTP_TRY)
    temporary_password = models.CharField(max_length=9, null=True)
    otp_max_out = models.DateTimeField(blank=True, null=True)
    phone_number = models.CharField(max_length=10, null=False, blank=False)
    gender = models.SmallIntegerField(choices=GENDER_CHOICES, null=True)
    address = models.TextField(null=False, blank=False)
    
    company = models.TextField(null=False, blank=False)
    location = models.TextField(null=False, blank=True)
    city = models.CharField(max_length=50, null=False, blank=False)
    country = models.CharField(max_length=50, null=False, blank=False)
    zip_code = models.CharField(max_length=10, null=False, blank=False)
    region = models.CharField(max_length=10, null=False, blank=False)
    first_name = models.CharField(max_length=50, null=False, blank=False)
    last_name = models.CharField(max_length=50, null=False, blank=False)
    phone_number = models.CharField(max_length=10, null=False, blank=False)
    industry_type = models.CharField(max_length=100, null=False, blank=False)  # 
    job_role = models.TextField(null=False, blank=False)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    user_registered_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"

    objects = UserManager()

    def __str__(self):
        return self.email


class UserSurveyQuestions(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, primary_key=True)
    eligible = models.BooleanField(null=False,blank=False, default=False)
    answers = models.JSONField(null=False, blank=False)
    updated_time = models.DateTimeField(auto_now_add=True)


class EnergyConsumption(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    financial_year = models.SmallIntegerField(validators=[MinValueValidator(2019), MaxValueValidator(now().year)])
    consumption = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(99999)])
    files_list = models.TextField(null=False, blank=False)
    update_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'financial_year')

    @property
    def string_list(self):
        return json.loads(self.files_list) if self.files_list else []

    @string_list.setter
    def string_list(self, value):
        self.files_list = json.dumps(value)

class FuelConsumption(models.Model):
    # FUEL_TYPES = [
    #     ('diesel', 'Diesel'),
    #     ('kerosene', 'Kerosene'),
    #     ('propane', 'Propane'),
    #     ('butane', 'Butane'),
    #     ('petrol', 'Petrol'),
    #     ('coal', 'Coal'),
    #     ('natural_gas', 'Natural Gas'),
    #     ('other', 'Other'),
    #     ('none', 'None'),
    # ]

    # CONSUMPTION_UNITS = [
    #     ('litres', 'Litres'),
    #     ('kgs', 'Kilograms'),
    # ]

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    fuel_type = models.CharField(max_length=20)
    consumption_quantity = models.FloatField(null=True, blank=True)
    consumption_unit = models.CharField(max_length=20)
    year = models.CharField(max_length=20)
    has_submitted_yearly = models.BooleanField(default=False)
    has_submitted_monthly = models.BooleanField(default=False)
    submitted_months = models.JSONField(default=dict)  # store month data in dict format
    fuel_data_yearly = models.JSONField(default=dict)  # Store multiple fuel types and consumption data here
    total_co2e_value=models.FloatField(null=True, blank=True)
    def mark_month_submitted(self, month, fuel_type, consumption_quantity, consumption_unit,co2e_value):
        # Check if the month is already in submitted_months
        if month not in self.submitted_months:
            self.submitted_months[month] = {}

        # Check if the fuel type for this month has already been submitted
        if fuel_type in self.submitted_months[month]:
            raise ValueError(f'Fuel type "{fuel_type}" for {month} already submitted.')

        # Store fuel details for the submitted fuel type in the given month
        self.submitted_months[month][fuel_type] = {
            'consumption_quantity': consumption_quantity,
            'consumption_unit': consumption_unit,
            'co2e_value': co2e_value   
        }
        self.save()
    def calculate_total_co2e(self):
        total_co2e = 0.0
        for month_data in self.submitted_months.values():
            for fuel_data in month_data.values():
                total_co2e += fuel_data.get('co2e_value', 0.0)
        return total_co2e
    def has_submitted_fuel_type_for_month(self, month, fuel_type):
        # Check if the month and fuel type have been submitted
        return month in self.submitted_months and fuel_type in self.submitted_months[month]

    def has_submitted_month(self, month):
        return month in self.submitted_months

    def check_all_months_submitted(self):
        all_months = [choice[0] for choice in Months]  # Ensure Months choice list is available
        if all(month in self.submitted_months for month in all_months):
            self.has_submitted_monthly = True
            self.save()

    def __str__(self):
        return f'{self.user.email} - {self.year}'
    
    


class AdditionalFiles(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    financial_year = models.SmallIntegerField(validators=[MinValueValidator(2019), MaxValueValidator(now().year)])
    file_type = models.CharField(max_length=20, validators=[validate_file_type])
    files_list = models.TextField(null=False, blank=False)
    update_time = models.DateTimeField(auto_now_add=True)

    @property
    def string_list(self):
        return json.loads(self.files_list) if self.files_list else []

    @string_list.setter
    def string_list(self, value):
        self.files_list = json.dumps(value)


class NewsLetter(models.Model):
    email = models.EmailField(
        max_length=50,
        blank=False,
        null=False,
        validators=[validate_email],
    )

    def __str__(self):
        return self.email


class UserElectricitySubmission(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    year = models.CharField(max_length=20)
    has_submitted_yearly = models.BooleanField(default=False)
    has_submitted_monthly = models.BooleanField(default=False)
    submitted_months = models.JSONField(default=dict)  # To track submitted months
    monthly_electricity_values = models.JSONField(default=dict)
    electricity_value = models.FloatField(null=True, blank=True)
    co2e_value = models.FloatField(null=True, blank=True)  # New field

    def mark_month_submitted(self, month):
        self.submitted_months[month] = True
        self.save()
        self.check_all_months_submitted()

    def has_submitted_month(self, month):
        return self.submitted_months.get(month, False)

    def check_all_months_submitted(self):
        all_months = [choice[0] for choice in Months]  # Use choice keys for comparison
        if all(month in self.submitted_months and self.submitted_months[month] for month in all_months):
            self.has_submitted_monthly = True
            self.save()

    def __str__(self):
        return f'{self.user.email} - {self.year}'


class Transport(models.Model):
    TRANSPORT_MODES = [
        ('Air', 'Air'),
        ('Road', 'Road'),
        ('Rail', 'Rail'),
        ('Sea', 'Sea'),
    ]
    WEIGHT_UNITS = [
        ('Tonnes', 'Tonnes'),
        ('Kgs', 'Kgs'),
    ]
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    mode_of_transport = models.CharField(max_length=10, choices=TRANSPORT_MODES)
    distance_kms = models.FloatField()
    start_location = models.CharField(max_length=255, null=True, blank=True)
    end_location = models.CharField(max_length=255, null=True, blank=True)
    weight = models.FloatField()
    weight_unit = models.CharField(max_length=10, choices=WEIGHT_UNITS)
    materials_being_shipped = models.TextField(null=True, blank=True)
    month = models.CharField(max_length=20, choices=Months, null=True, blank=True)  # Add month field
    year = models.CharField(max_length=20)
    submission = models.ForeignKey('UserTransportSubmission', on_delete=models.CASCADE, related_name='transports', null=True, blank=True)

    def __str__(self):
        return f'{self.user.email}- Mode: {self.mode_of_transport}'


class UserTransportSubmission(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    year = models.CharField(max_length=20)
    has_submitted_yearly = models.BooleanField(default=False)
    has_submitted_monthly = models.BooleanField(default=False)
    month = models.CharField(max_length=20, choices=Months, null=True, blank=True)
    submitted_months = models.JSONField(default=dict)  # To track submitted months
    # transport = models.OneToOneField('Transport', related_name='user_transport_submission', on_delete=models.CASCADE,null=True, blank=True)
    def mark_month_submitted(self, month):
        self.submitted_months[month] = True
        self.save()
        self.check_all_months_submitted()

    def has_submitted_month(self, month):
        return self.submitted_months.get(month, False)

    def check_all_months_submitted(self):
        all_months = [choice[0] for choice in Months]  # Use choice keys for comparison
        if all(month in self.submitted_months and self.submitted_months[month] for month in all_months):
            self.has_submitted_monthly = True
            self.save()

    def __str__(self):
        return f'{self.user.email}'
    

class Vehicles(models.Model):
    VEHICLE_TYPES = [
        ('Sedan', 'Sedan'),
        ('SUV', 'SUV'),
        ('Truck', 'Truck'),
        ('Semi-truck', 'Semi-truck'),
    ]

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    number_of_vehicles = models.PositiveIntegerField()
    rto_number = models.CharField(max_length=14)
    update_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_type} - {self.rto_number} "


class SupplyChainRawMaterial(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    material_name = models.CharField(max_length=255)
    weight=models.FloatField() 
    weight_unit = models.CharField(max_length=10)  # e.g., kgs, ltr, tons
    cost = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    region=models.CharField(max_length=10,null=True,blank=True)
    co2e=models.FloatField() 
    co2e_unit=models.CharField(max_length=10)
    currency=models.CharField(max_length=7)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email} - {self.material_name} "


class SalesFinanceData(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    year = models.CharField(max_length=12)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email} - {self.year} "
      
class UserEligibility(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES)
    sub_sector = models.CharField(max_length=50, choices=SUB_SECTOR_CHOICES, blank=True, null=True)
    country = models.CharField(max_length=50, choices=COUNTRY, blank=True, null=True)
    activity_performed = models.CharField(max_length=50, choices=ACTIVITY_PERFORMED_CHOICES, blank=True, null=True)
    data_available = models.JSONField(null=True, blank=True)  # Allows for multiple selections
    eligible = models.BooleanField(default=False)
    attempts = models.JSONField(default=dict) 
    def __str__(self):
        return f'{self.user.email} - Eligibility: {"Eligible" if self.eligible else "Not Eligible"}'


class EndOfLifeProduct(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    weight_kg = models.FloatField()
    disposal_method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email}-{self.product_name} - {self.weight_kg} kg"










# My code

from django.utils import timezone
import os
import calendar
from collections import namedtuple
from decimal import Decimal
from django.core import validators
from django.core import exceptions



YEAR_CHOICES = tuple([(f'FY{i}', f'FY{i}') for i in range(2015, (timezone.now().year)+1)])

MONTH_CHOICES = tuple([(calendar.month_abbr[i], calendar.month_abbr[i]) for i in range(1, 13)])


def walk_up_and_delete_empty(path, user_email):
  while True:
    if not os.listdir(path):
      os.rmdir(path)
    else:
      break
    path = os.path.dirname(path)
    if os.path.basename(path) == user_email:
      os.rmdir(path)
      break


# Declaring a named tuple
Fuel = namedtuple('Fuel', ['name', 'emission_factor', 'unit'])


FUEL_DETAILS = {
  'Diesel': Fuel('Diesel', Decimal(2.68), 'Kg per liter'),
  'Petrol': Fuel('Petrol', Decimal(2.31), 'Kg per liter'),
  'Kerosene': Fuel('Kerosene', Decimal(2.50), 'Kg per liter'),
  'Butane': Fuel('Butane', Decimal(1.70), 'Kg per liter'),
  'Propane': Fuel('Propane', Decimal(1.50), 'Kg per liter'),
  'LPG': Fuel('LPG', Decimal(1.51), 'Kg per liter'),
  'CNG': Fuel('CNG', Decimal(2.67), 'Kg per Kg'),
  'Coal': Fuel('Coal', Decimal(3.00), 'Kg per Kg'),
}


FUEL_CHOICES = tuple([(fuel, fuel) for fuel in FUEL_DETAILS])

FUEL_UNIT_CHOICES = tuple(set([(FUEL_DETAILS[fuel].unit.split(' ')[-1], FUEL_DETAILS[fuel].unit.split(' ')[-1]) for fuel in FUEL_DETAILS]))

ENERGY_EMISSION_FACTOR = Decimal(0.82)  # kgCO2/kWh

TransportMode = namedtuple('TransportMode', ['name', 'emission_factor', 'unit'])


TRANSPORT_MODE_DETAILS = {
  'Road': TransportMode('Road', Decimal(0.05), 'kgco2 per Ton Km'),
  'Rail': TransportMode('Rail', Decimal(1.0), 'kgco2 per Ton Km'),
  'Sea': TransportMode('Sea', Decimal(1.3), 'kgco2 per Ton Km'),
  'Air': TransportMode('Air', Decimal(1.5), 'kgco2 per Ton Km'),
}


TRANSPORT_MODE_CHOICES = tuple([(mode, mode) for mode in TRANSPORT_MODE_DETAILS])

WEIGHT_UNIT_CHOICES = (
  ('Ton', 'Ton'),
  ('Kg', 'Kg'),
)

DISTANCE_UNIT_CHOICES = (
  ('Km', 'Km'),
  ('Mile', 'Mile')
)


class Years(models.Model):
  year = models.CharField(max_length=50, choices=YEAR_CHOICES)


class Months(models.Model):
  month = models.CharField(max_length=50, choices=MONTH_CHOICES)

    
class FuelMonthly(models.Model):
  created = models.DateTimeField(default=timezone.now)
  fuel = models.CharField(max_length=25, choices=FUEL_CHOICES)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  month = models.CharField(max_length=10, choices=MONTH_CHOICES)
  consumption = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  unit = models.CharField(max_length=20, choices=FUEL_UNIT_CHOICES)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='fuel_monthly_users', on_delete=models.CASCADE)
  co2e_kg = models.DecimalField(max_digits=7, decimal_places=2)

  def delete(self, *args, **kwargs):
    files = []
    try:
      for obj in self.files.all():
        file_path = obj.file.path
        files.append(file_path)
      super().delete(*args, **kwargs)
    except:
      raise exceptions.ValidationError('record cant be deleted')
    else:
      folder_path = os.path.dirname(files[0])
      for file in files:
        if os.path.exists(file):
          os.remove(file)
      walk_up_and_delete_empty(folder_path,self.user.email)

  def __str__(self):
    return f'{self.id}_{self.user}_{self.year}_{self.month}_{self.fuel}'
  
  class Meta:
     verbose_name = 'Fuel Monthly'


def fuel_monthly_upload(instance, filename):
  path = os.path.join(instance.fuel_monthly.user.email, 'Docs', 'Fuel', 'Month')
  return os.path.join(path, filename)


class FuelMonthlyFile(models.Model):
  fuel_monthly = models.ForeignKey(FuelMonthly, on_delete=models.CASCADE, related_name='files')
  file = models.FileField(upload_to=fuel_monthly_upload)
  
  def __str__(self):
    return f'{self.id}_{self.file.name}'

  class Meta:
     verbose_name = 'Fuel Monthly File'


class FuelYearly(models.Model):
  created = models.DateTimeField(default=timezone.now)
  fuel = models.CharField(max_length=25, choices=FUEL_CHOICES)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  consumption = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  unit = models.CharField(max_length=20, choices=FUEL_UNIT_CHOICES)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='fuel_yearly_users', on_delete=models.CASCADE)
  co2e_kg = models.DecimalField(max_digits=7, decimal_places=2)

  def delete(self, *args, **kwargs):
    files = []
    try:
      for obj in self.files.all():
        file_path = obj.file.path
        files.append(file_path)
      super().delete(*args, **kwargs)
    except:
      raise exceptions.ValidationError('record cant be deleted')
    else:
      folder_path = os.path.dirname(files[0])
      for file in files:
        if os.path.exists(file):
          os.remove(file)
      walk_up_and_delete_empty(folder_path,self.user.email)

  def __str__(self):
    return f'{self.id}_{self.user}_{self.year}_{self.fuel}'
  
  class Meta:
     verbose_name = 'Fuel Yearly'


def fuel_yearly_upload(instance, filename):
  path = os.path.join(instance.fuel_yearly.user.email, 'Docs', 'Fuel', 'Year')
  return os.path.join(path, filename)


class FuelYearlyFile(models.Model):
  fuel_yearly = models.ForeignKey(FuelYearly, on_delete=models.CASCADE, related_name='files')
  file = models.FileField(upload_to=fuel_yearly_upload)

  def __str__(self):
    return f'{self.id}_{self.file.name}'

  class Meta:
     verbose_name = 'Fuel Yearly File'
  

class EnergyMonthly(models.Model):
  created = models.DateTimeField(default=timezone.now)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  month = models.CharField(max_length=10, choices=MONTH_CHOICES)
  consumption = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='energy_monthly_users', on_delete=models.CASCADE)
  co2e_kg = models.DecimalField(max_digits=7, decimal_places=2)

  def delete(self, *args, **kwargs):
    files = []
    try:
      for obj in self.files.all():
        file_path = obj.file.path
        files.append(file_path)
      super().delete(*args, **kwargs)
    except:
      raise exceptions.ValidationError('record cant be deleted')
    else:
      folder_path = os.path.dirname(files[0])
      for file in files:
        if os.path.exists(file):
          os.remove(file)
      walk_up_and_delete_empty(folder_path,self.user.email)

  def __str__(self):
    return f'{self.id}_{self.user}_{self.year}_{self.month}_energy'
  
  class Meta:
     verbose_name = 'Energy Monthly'


def energy_monthly_upload(instance, filename):
  path = os.path.join(instance.energy_monthly.user.email, 'Docs', 'Energy', 'Month')
  return os.path.join(path, filename)


class EnergyMonthlyFile(models.Model):
  energy_monthly = models.ForeignKey(EnergyMonthly, on_delete=models.CASCADE, related_name='files')
  file = models.FileField(upload_to=energy_monthly_upload)

  def __str__(self):
    return f'{self.id}_{self.file.name}'

  class Meta:
     verbose_name = 'Energy Monthly File'


class EnergyYearly(models.Model):
  created = models.DateTimeField(default=timezone.now)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  consumption = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='energy_yearly_users', on_delete=models.CASCADE)
  co2e_kg = models.DecimalField(max_digits=7, decimal_places=2)

  def delete(self, *args, **kwargs):
    files = []
    try:
      for obj in self.files.all():
        file_path = obj.file.path
        files.append(file_path)
      super().delete(*args, **kwargs)
    except:
      raise exceptions.ValidationError('record cant be deleted')
    else:
      folder_path = os.path.dirname(files[0])
      for file in files:
        if os.path.exists(file):
          os.remove(file)
      walk_up_and_delete_empty(folder_path,self.user.email)

  def __str__(self):
    return f'{self.id}_{self.user}_{self.year}_energy'
  
  class Meta:
     verbose_name = 'Energy Yearly'


def energy_yearly_upload(instance, filename):
  path = os.path.join(instance.energy_yearly.user.email, 'Docs', 'Energy', 'Year')
  return os.path.join(path, filename)


class EnergyYearlyFile(models.Model):
  
  energy_yearly = models.ForeignKey(EnergyYearly, on_delete=models.CASCADE, related_name='files')
  file = models.FileField(upload_to=energy_yearly_upload)

  def __str__(self):
    return f'{self.id}_{self.file.name}'

  class Meta:
     verbose_name = 'Energy Yearly File'


class TransportMonthly(models.Model):
  created = models.DateTimeField(default=timezone.now)
  mode = models.CharField(max_length=25, choices=TRANSPORT_MODE_CHOICES)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  month = models.CharField(max_length=10, choices=MONTH_CHOICES)
  distance = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  distance_unit = models.CharField(max_length=20, choices=DISTANCE_UNIT_CHOICES)
  weight = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  weight_unit = models.CharField(max_length=25, choices=WEIGHT_UNIT_CHOICES)
  start = models.CharField(max_length=200, blank=True, null=True)
  end = models.CharField(max_length=200, blank=True, null=True)
  materials = models.TextField(blank=True, null=True)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='transport_monthly_users', on_delete=models.CASCADE)
  co2e_kg = models.DecimalField(max_digits=7, decimal_places=2)

  class Meta:
     verbose_name = 'Transport Monthly'

  def __str__(self):
    return f'{self.id}_{self.user}_{self.year}_{self.month}_transport'

class TransportYearly(models.Model):
  created = models.DateTimeField(default=timezone.now)
  mode = models.CharField(max_length=25, choices=TRANSPORT_MODE_CHOICES)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  distance = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  distance_unit = models.CharField(max_length=20, choices=DISTANCE_UNIT_CHOICES)
  weight = models.DecimalField(max_digits=7, decimal_places=2, validators=[validators.MinValueValidator(Decimal(0.0))])
  weight_unit = models.CharField(max_length=25, choices=WEIGHT_UNIT_CHOICES)
  start = models.CharField(max_length=200, blank=True, null=True)
  end = models.CharField(max_length=200, blank=True, null=True)
  materials = models.TextField(blank=True, null=True)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='transport_yearly_users', on_delete=models.CASCADE)
  co2e_kg = models.DecimalField(max_digits=7, decimal_places=2)

  class Meta:
     verbose_name = 'Tranport Yearly'


def transport_monthly_upload(instance, filename):
  path = os.path.join(instance.user.email, 'Docs', 'Trans', 'Month')
  return os.path.join(path, filename)


class TransportMonthlyFiles(models.Model):
  created = models.DateTimeField(default=timezone.now)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  month = models.CharField(max_length=10, choices=MONTH_CHOICES)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='transport_monthly_files_users', on_delete=models.CASCADE)
  file = models.FileField(upload_to=transport_monthly_upload)


  class Meta:
     verbose_name = 'Transport Monthly File'

  def delete(self, *args, **kwargs):
    
    try:
      file_path = self.file.path
      folder_path = os.path.dirname(file_path)
    except:
      file_path = ''

    try:
      super().delete(*args, **kwargs)
    except:
      raise exceptions.ValidationError('record cant be deleted')
    else:
      if os.path.exists(file_path):
        os.remove(file_path)
        walk_up_and_delete_empty(folder_path, self.user)
    

def transport_yearly_upload(instance, filename):
  path = os.path.join(instance.user.email, 'Docs', 'Trans', 'Year')
  return os.path.join(path, filename)


class TransportYearlyFiles(models.Model):
  created = models.DateTimeField(default=timezone.now)
  year = models.CharField(max_length=10, choices=YEAR_CHOICES)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='transport_yearly_files_users', on_delete=models.CASCADE)
  file = models.FileField(upload_to=transport_yearly_upload)

  class Meta:
     verbose_name = 'Transport Yearly File'

  def delete(self, *args, **kwargs):
    
    try:
      file_path = self.file.path
      folder_path = os.path.dirname(file_path)
    except:
      file_path = ''

    try:
      super().delete(*args, **kwargs)
    except:
      raise exceptions.ValidationError('record cant be deleted')
    else:
      if os.path.exists(file_path):
        os.remove(file_path)
        walk_up_and_delete_empty(folder_path, self.user)
