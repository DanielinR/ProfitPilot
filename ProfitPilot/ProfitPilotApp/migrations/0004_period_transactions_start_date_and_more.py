# Generated by Django 4.2.6 on 2023-11-08 09:39

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProfitPilotApp', '0003_period_transactions_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='period_transactions',
            name='start_date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
