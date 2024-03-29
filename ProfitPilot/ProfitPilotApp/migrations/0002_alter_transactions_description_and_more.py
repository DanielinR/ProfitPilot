# Generated by Django 4.2.6 on 2023-11-06 10:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ProfitPilotApp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transactions',
            name='description',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='periodTransaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ProfitPilotApp.period_transactions'),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='typesTransactions',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ProfitPilotApp.types_transactions'),
        ),
        migrations.AlterField(
            model_name='types_transactions',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
