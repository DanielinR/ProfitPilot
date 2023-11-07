const url = '/transaction_types'

function getFormData() {
    return {
            'name': $("#name_transaction_types").val(),
            'description': $("#description_transaction_types").val()
            };
}

function fillTemplateClone(clone, transaction_type) {
    clone.querySelector('.name_transaction_types').textContent = transaction_type.name;
    clone.querySelector('.description_transaction_types').textContent = transaction_type.description;
}