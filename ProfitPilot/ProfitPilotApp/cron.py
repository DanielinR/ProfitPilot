import datetime
import os
import django
from django.conf import settings
import datetime

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ProfitPilot.settings')
django.setup()

from ProfitPilotApp.models import Period_Transactions
from ProfitPilotApp.models import Transactions

def periodic_transactions():
    periodic_transactions = Period_Transactions.objects.all().order_by('-id')
    for periodic_transaction in periodic_transactions:
        create_Transactions(periodic_transaction)

def create_Transactions(periodic_transaction):
    hoy = datetime.date.today()
    fecha_correcta = comprobar_Fecha(periodic_transaction.start_date,
                            periodic_transaction.period_days,
                            hoy)
    transaccion_existente = Transactions.objects.filter(periodTransaction=periodic_transaction, date=hoy).exists()

    if fecha_correcta and not transaccion_existente:
        new_transaction = Transactions(description=periodic_transaction.description, amount=periodic_transaction.amount,
                                       date=hoy, user=periodic_transaction.user,
                                       typesTransactions=periodic_transaction.transaction_type,
                                       periodTransaction=periodic_transaction)
        new_transaction.save()

def comprobar_Fecha(start_date, period_days, date):
    diference = date - start_date
    if diference.days == 0:
        return False
    if diference.days % period_days == 0:
        return True
    return False

if __name__ == '__main__':
    periodic_transactions()