from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.
class Types_Transactions(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Period_Transactions(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    amount = models.FloatField()
    description = models.TextField()
    period_days = models.IntegerField()
    start_date = models.DateField(default=datetime.date.today)
    transaction_type = models.ForeignKey(Types_Transactions, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.description} ({self.amount}€ cada {self.period_days} días)"

class Transactions(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=0)
    periodTransaction = models.ForeignKey(Period_Transactions, on_delete=models.SET_NULL, null=True, blank=True)
    typesTransactions = models.ForeignKey(Types_Transactions, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=datetime.date.today)

    def __str__(self):
        return f"{self.amount}€ - {self.description}"
