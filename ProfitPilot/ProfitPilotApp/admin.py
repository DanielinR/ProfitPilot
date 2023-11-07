from django.contrib import admin

from . import models
# Register your models here.
admin.site.register(models.Transactions)
admin.site.register(models.Period_Transactions)
admin.site.register(models.Types_Transactions)