function transactionTypes_update(idSelect){
     $.get("/transaction_types", function(data, status){
        $("#"+idSelect).empty()
          const newOption = document.createElement('option');
          newOption.textContent = "";
          newOption.value = "";
          document.getElementById(idSelect).appendChild(newOption);
        $.each(data, function(index, transaction_type) {
          const newOption = document.createElement('option');
          newOption.textContent = transaction_type.name;
          newOption.value = transaction_type.id;
          document.getElementById(idSelect).appendChild(newOption);
        });
    });
}