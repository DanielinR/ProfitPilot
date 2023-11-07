from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

app_name = "profit_pilot"

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.log_in, name="login"),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path("transaction/<int:id>", views.transaction, name="transaction"),
    path("transaction", views.transaction, name="transaction"),
    path("profit_month", views.profit_month, name="profit_month"),
    path("periodic_transactions_page", views.periodic_transactions_page, name="periodic_transactions_page"),
    path("periodic_transactions", views.periodic_transactions, name="periodic_transactions"),
    path("periodic_transactions/<int:id>", views.periodic_transactions, name="periodic_transactions"),
    path("transaction_types_page", views.transaction_types_page, name="transaction_types_page"),
    path("transaction_types", views.transaction_types, name="transaction_types"),
    path("transaction_types/<int:id>", views.transaction_types, name="transaction_types"),
]