$(document).ready(function() {
    cargarPeriodicTransaction();
    $("#cards_period_transactions").on("click", ".deleteButton_periodicTransactions", function() {deletePeriodicTransaction($(this).data("id"));});
    $("#open_form_transaction_button").click(function() {showTransactionCreator();});
    $("#card_create_period_transactions").submit(function() {createPeriodicTransaction();});
});

document.addEventListener('click', function(event) {
  var isClickInsideSideTransactionForm = document.getElementById('card_create_period_transactions').contains(event.target);
  var isClickInsideOpenTransactionButton = document.getElementById('open_form_transaction_button').contains(event.target);

  if (!isClickInsideSideTransactionForm && !isClickInsideOpenTransactionButton) {
    hideTransactionCreator();
  }
});

function deletePeriodicTransaction(id){
    var confirmed = confirm('Are you sure you want to delete this?');
    if(!confirmed){ return ""}
    $.ajax({
        url: '/periodic_transactions/' + id,
        type: 'DELETE',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(result) {
            cargarPeriodicTransaction()
        },
        error: function(xhr, status, error) {
            console.log("Error al eliminar la transacción:", error);
        }
    });
}

function createPeriodicTransaction(){
    period = 30;
    if($("#period_period_transactions").val() != ''){
     period = $("#period_period_transactions").val();
    }
    $.ajax({
        url: "/periodic_transactions",
        type: "POST",
        data: {
            'amount': $("#amount_period_transactions").val(),
            'description': $("#description_period_transactions").val(),
            'period': period
        },
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(response) {
            $("#feedback").html('');
            hideTransactionCreator()
            form_reset()
            cargarPeriodicTransaction()
        },
        error: function(xhr, status, error) {
            $("#feedback").html(xhr.responseText);
            feedbackText_setClass("color_red")
        }
    });
}

function cargarPeriodicTransaction(){
    $.get("/periodic_transactions", function(data, status){
        $("#cards_period_transactions").empty()
        $.each(data, function(index, periodic_transaction) {
            var transaction_last_date = new Date(periodic_transaction.last_date);
            var transaction_next_date = new Date(periodic_transaction.last_date);
            if(transaction_next_date.getTime() != 0 ){
                transaction_next_date.setDate(transaction_next_date.getDate() + 30);
            }

            var newElement =
                '<div style="display: flex; margin: 1rem; width: 100%;">' +
                    '<div class="card separated_rows card_periodicTransactions" style="margin-right: 0;">' +
                       ' <div class="description_periodicTransactions">' + periodic_transaction.description + '</div>' +
                       ' <div class="periodicTransactions separated_rows">' +
                            '<div class="amount_periodicTransactions">' + periodic_transaction.amount + '€</div>' +
                            '<div class="period_periodicTransactions">' +
                                '<span>Period: </span>' +
                                '<span>' + periodic_transaction.period_days + ' days</span>' +
                            '</div>' +
                            '<div class="separated_columns">' +
                                '<div class="font_small centered_columns">' +
                                    '<span>Last payment:</span>' +
                                    '<span>' + formatDate(transaction_last_date) + '</span>' +
                                '</div>' +
                                '<div class="font_small centered_columns">' +
                                    '<span>Next payment:</span>' +
                                    '<span>' + formatDate(transaction_next_date) + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<button data-id="' + periodic_transaction.id + '" class="deleteButton_periodicTransactions">🗑️</button>' +
                '</div>';

            $("#cards_period_transactions").append(newElement);
        });
    });
}

function formatDate(date) {
    if(date.getTime() == 0){
     return ""
    }
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '/' + month + '/' + year;
}
function getCookie(name) {
  //found on: "https://testdriven.io/blog/django-ajax-xhr/"
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function showTransactionCreator() {
  document.getElementById('card_create_period_transactions').style.display = 'flex';
  document.getElementById('page-overlay').style.display = 'block';
}

function hideTransactionCreator() {
  document.getElementById('card_create_period_transactions').style.display = 'none';
  document.getElementById('page-overlay').style.display = 'none';
}

function feedbackText_setClass(classAdded){
    $("#feedback").removeClass();
    $("#feedback").addClass(classAdded);
}

function form_reset(){
    $("#period_period_transactions").val("")
    $("#amount_period_transactions").val("")
    $("#description_period_transactions").val("")
}