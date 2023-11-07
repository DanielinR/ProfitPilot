from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.views.decorators.cache import never_cache
from django.contrib import messages
from django.utils import timezone
from . import models
from django.http import HttpResponse, Http404, JsonResponse

# Create your views here.
@never_cache
def log_in(request):
    if request.user.is_authenticated:
        return redirect("profit_pilot:index")

    if request.method == 'POST':
        password = request.POST["password"]
        username = request.POST["username"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("profit_pilot:index")
        else:
            messages.error(request, 'Nombre de usuario o contraseña incorrectos')

    return render(request, "ProfitPilot/login.html", {"loginscreen": True})

def index(request):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:login")

    return render(request, "ProfitPilot/index.html", {})

def transaction(request, id=None):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:login")

    if request.method == 'POST':
        try:
            amount = round(float(request.POST["amount"]), 2)
            if amount == 0: raise ValueError("amount")
            description = request.POST["description"]
            new_transaction = models.Transactions(description=description, amount=amount, date=timezone.now(), user= request.user)
            new_transaction.save()
            return HttpResponse("Created transaction", status=200)
        except Exception as e:
            if e.args[0] == "amount":
                return HttpResponse("Amount required", status=400)
            return HttpResponse("Incorrect data", status=400)

    else:
        try:
            if id == None:
                response = list(models.Transactions.objects.all().order_by('-id').values())
            else:
                response = models.Transactions.objects.values().get(id=id)
            return JsonResponse(response, safe=False)
        except models.Transactions.DoesNotExist:
            raise Http404()

def profit_month(request):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:index")

    try:
        month = timezone.now().month
        month_transactions = list(models.Transactions.objects.all().filter(date__month=month).values())

        profit = 0
        for transaction in month_transactions:
            profit += float(transaction["amount"])

        return JsonResponse(round(profit, 2), safe=False)
    except models.Transactions.DoesNotExist:
        raise Http404()

def periodic_transactions_page(request):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:index")
    return render(request, "ProfitPilot/periodicTransactions.html", {})

def periodic_transactions(request, id=None):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:login")

    if request.method == 'POST':
        try:
            amount = round(float(request.POST["amount"]), 2)
            if amount == 0:
                raise ValueError("amount")
            period = int(request.POST["period"])
            description = request.POST["description"]
            if description.strip() == '':
                raise ValueError("description")
            new_period_transaction = models.Period_Transactions(description=description, amount=amount, period_days=period,
                                                                user=request.user)
            new_period_transaction.save()
            return HttpResponse("Created transaction", status=200)
        except Exception as e:
            if e.args[0] == "amount":
                return HttpResponse("Amount required", status=400)
            elif e.args[0] == "description":
                return HttpResponse("Description required", status=400)
            return HttpResponse("Incorrect data", status=400)

    elif request.method == 'GET':
        try:
            if id == None:
                response = list(models.Period_Transactions.objects.all().order_by('-id').values())
                for i in range(len(response)):
                    response[i] = periodic_transaction_withDates(response[i])
            else:
                response = models.Period_Transactions.objects.values().get(id=id)
                response = periodic_transaction_withDates(response)
            return JsonResponse(response, safe=False)
        except models.Period_Transactions.DoesNotExist:
            raise Http404()
    elif request.method == 'DELETE':
        try:
            periodic_transaction = models.Period_Transactions.objects.get(id=id)
            periodic_transaction.delete()
            return HttpResponse('Deleted successfully.', status=200)
        except models.Period_Transactions.DoesNotExist:
            raise Http404()

def periodic_transaction_withDates(period_transaction):
    transactions = models.Transactions.objects.order_by('date').filter(periodTransaction_id = period_transaction["id"]).values()
    first_transaction_date = None
    last_transaction_date = None
    if transactions.count() != 0:
        first_transaction_date = transactions.first()["date"]
        last_transaction_date = transactions.last()["date"]

    dict_dates = {"first_date": first_transaction_date, "last_date": last_transaction_date, }
    period_transaction.update(dict_dates)

    return period_transaction

def transaction_types_page(request):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:index")
    return render(request, "ProfitPilot/transactionTypes.html", {})

def transaction_types(request, id=None):
    if not request.user.is_authenticated:
        return redirect("profit_pilot:login")

    if request.method == 'POST':
        try:
            description = request.POST["description"]
            name = request.POST["name"]
            if name.strip() == '':
                raise ValueError("name")
            new_transaction_type = models.Types_Transactions(description=description, name=name, user=request.user)
            new_transaction_type.save()
            return HttpResponse("Created transaction type", status=200)
        except Exception as e:
            if e.args[0] == "name":
                return HttpResponse("Name required", status=400)
            return HttpResponse("Incorrect data", status=400)

    elif request.method == 'GET':
        try:
            if id == None:
                response = list(models.Types_Transactions.objects.all().order_by('-id').values())
            else:
                response = models.Types_Transactions.objects.values().get(id=id)
            return JsonResponse(response, safe=False)
        except models.Types_Transactions.DoesNotExist:
            raise Http404()
    elif request.method == 'DELETE':
        try:
            transaction_type = models.Types_Transactions.objects.get(id=id)
            transaction_type.delete()
            return HttpResponse('Deleted successfully.', status=200)
        except models.Types_Transactions.DoesNotExist:
            raise Http404()
