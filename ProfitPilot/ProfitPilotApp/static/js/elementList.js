$(document).ready(function() {
    loadList();
    $("#cards_list").on("click", ".deleteButton_list", function() {deleteElement($(this).data("id"));});
    $("#card_create").submit(function() {createElement();});
    $("#open_form_button").click(function() {showTransactionCreator();});
});

//funcion para cerrar el formulario de creacion
document.addEventListener('click', function(event) {
  var isClickInsideSideTransactionForm = document.getElementById('card_create').contains(event.target);
  var isClickInsideOpenTransactionButton = document.getElementById('open_form_button').contains(event.target);

  if (!isClickInsideSideTransactionForm && !isClickInsideOpenTransactionButton) {
    hideTransactionCreator();
  }
});

function deleteElement(id){
    var confirmed = confirm('Are you sure you want to delete this?');
    if(!confirmed){ return ""}
    deleteElement_ajaxRequest(id)
     .then(() => {
        loadList();
    })
    .catch(function(xhr, status, error){
        console.error("Error deleting element:", error);
    });
}

function deleteElement_ajaxRequest(id){
    return $.ajax({
        url: url + '/' + id,
        type: 'DELETE',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        }
    });
}

function createElement(){
    createElement_ajaxRequest()
     .then(() => {
        $("#feedback").html('');
        hideTransactionCreator();
        form_reset();
        loadList();
    })
    .catch(function(xhr, status, error){
         $("#feedback").html(xhr.responseText);
        feedbackText_setClass("color_red");
    });
}

function createElement_ajaxRequest(){
    return $.ajax({
        url: url,
        type: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        data: getFormData()
    });
}

function loadList(){
    $("#cards_list").empty()
    $.get(url, function(data, status){
        $.each(data, function(index, element) {
            insertElement(element)
        });
    });
}

function insertElement(element) {
    const template = document.querySelector('#element-template');
    const clone = document.importNode(template.content, true);

    fillTemplateClone(clone, element);

    clone.querySelector('.deleteButton_list').dataset.id = element.id;
    document.querySelector('#cards_list').append(clone);
}

function showTransactionCreator() {
  document.getElementById('card_create').style.display = 'flex';
  document.getElementById('page-overlay').style.display = 'block';
}

function hideTransactionCreator() {
  document.getElementById('card_create').style.display = 'none';
  document.getElementById('page-overlay').style.display = 'none';
}

function feedbackText_setClass(classAdded){
    $("#feedback").removeClass();
    $("#feedback").addClass(classAdded);
}

function form_reset(){
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
    if (input.id == "create_button"){return}
      if(input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
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
