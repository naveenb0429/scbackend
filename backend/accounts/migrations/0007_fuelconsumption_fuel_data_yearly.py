# Generated by Django 4.1 on 2024-09-11 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_alter_fuelconsumption_consumption_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='fuelconsumption',
            name='fuel_data_yearly',
            field=models.JSONField(default=dict),
        ),
    ]
