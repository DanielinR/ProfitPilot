const url = '/periodic_transactions'

$(document).ready(function() {
    transactionTypes_update("type_period_transactions");
});

function getFormData() {
    period = $("#period_period_transactions").val();
    period = period == '' ? 30 : period;

    data = {
            'amount': $("#amount_period_transactions").val(),
            'description': $("#description_period_transactions").val(),
            'type': $("#type_period_transactions").val(),
            'period': period
            };
    return data;
}

function fillTemplateClone(clone, periodic_transaction) {
    var transaction_last_date = new Date(periodic_transaction.last_date);
    var transaction_next_date = new Date(periodic_transaction.last_date);
    if(transaction_next_date.getTime() != 0 ){
        transaction_next_date.setDate(transaction_next_date.getDate() + periodic_transaction.period_days);
    }
    clone.querySelector('.description_periodicTransactions').textContent = periodic_transaction.description;
    clone.querySelector('.amount_periodicTransactions').textContent = `${periodic_transaction.amount}€`;
    clone.querySelector('.period_periodicTransactions').textContent = `${periodic_transaction.period_days} days`;
    clone.querySelector('.last_payment_date').textContent = formatDate(transaction_last_date);
    clone.querySelector('.next_payment_date').textContent = formatDate(transaction_next_date);
}