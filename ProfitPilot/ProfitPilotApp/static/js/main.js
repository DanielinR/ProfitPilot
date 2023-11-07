$(document).ready(function() {
    transactionsList_update()
    profitMonth_update()
    $("#transactions_button_positive").click(function() {makeTransaction($("#amount").val());})
    $("#transactions_button_negative").click(function() {makeTransaction(-($("#amount").val()));})
});
function makeTransaction(amount) {
    $.ajax({
        url: "/transaction",
        type: "POST",
        data: {
            'amount': amount,
            'description': $("#description").val()
        },
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(response) {
            $("#feedback").html(response);
            feedbackText_setClass("color_green")
            form_reset()
            transactionsList_update()
            profitMonth_update()
        },
        error: function(xhr, status, error) {
            $("#feedback").html(xhr.responseText);
            feedbackText_setClass("color_red")
        }
    });
}

function periodic_transactions(){

}

function feedbackText_setClass(classAdded){
    $("#feedback").removeClass();
    $("#feedback").addClass(classAdded);
}

function form_reset(){
    $("#amount").val("")
    $("#description").val("")
}

function transactionsList_update(){
    $.get("/transaction", function(data, status){
        $("#transactions_list").empty()
        $.each(data, function(index, transaction) {
        if (transaction.description == '') { transaction.description = 'No description provided'}
            var transaction_date = new Date(transaction.date);
            var newElement =
                '<div class="transactions_list_element">' +
                '<span class="transactions_list_amount">' + transaction.amount + ' €</span>' +
                '<span class="transactions_list_description">' + transaction.description + '</span>' +
                '<span>' + transaction_date.getDate() + "/" + (transaction_date.getMonth() + 1) + '</span>' +
                '</div>';
            $("#transactions_list").append(newElement);
        });
    });
}

function profitMonth_update(){
    $.get("/profit_month", function(data, status){
        $("#profit_month_amount").text(data + "€");
        $("#profit_month_amount").removeClass();
        if(data >= 0){
            $("#profit_month_amount").addClass("color_green");
        }else{
            $("#profit_month_amount").addClass("color_red");
        }
    });
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