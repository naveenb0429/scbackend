from django.contrib import admin
from .models import UserProfile, EnergyConsumption, UserSurveyQuestions, Transport, Vehicles, FuelConsumption, \
    AdditionalFiles, NewsLetter,UserElectricitySubmission,UserTransportSubmission ,SupplyChainRawMaterial,SalesFinanceData,UserEligibility,EndOfLifeProduct

admin.site.register(UserProfile)
admin.site.register(UserSurveyQuestions)
admin.site.register(EnergyConsumption)
admin.site.register(AdditionalFiles)
admin.site.register(NewsLetter)

admin.site.register(Vehicles)
admin.site.register(FuelConsumption)
admin.site.register(Transport)
admin.site.register(UserTransportSubmission)
admin.site.register(UserElectricitySubmission)
admin.site.register(SupplyChainRawMaterial)
admin.site.register(SalesFinanceData)
admin.site.register(UserEligibility)
admin.site.register(EndOfLifeProduct)


# my code
from . import models

admin.site.register(models.FuelMonthly)
admin.site.register(models.FuelMonthlyFile)
admin.site.register(models.FuelYearly)
admin.site.register(models.FuelYearlyFile)
admin.site.register(models.EnergyMonthly)
admin.site.register(models.EnergyMonthlyFile)
admin.site.register(models.EnergyYearly)
admin.site.register(models.EnergyYearlyFile)
admin.site.register(models.TransportMonthly)
admin.site.register(models.TransportYearly)
admin.site.register(models.TransportMonthlyFiles)
admin.site.register(models.TransportYearlyFiles)

