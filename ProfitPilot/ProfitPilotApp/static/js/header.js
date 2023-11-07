function openNav() {
    if (window.innerWidth > 1300) {
        document.getElementById("mySidebar").style.width = "17%";
    }else if (window.innerWidth > 920) {
        document.getElementById("mySidebar").style.width = "22%";
    } else {
        document.getElementById("mySidebar").style.width = "32%";
    }
}
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

// Añadir un evento de clic al documento, para cerrar la sidebar si se hace clic fuera de ella
document.addEventListener('click', function(event) {
  var isClickInsideSidebar = document.getElementById('mySidebar').contains(event.target);
  var isClickInsideOpenButton = document.getElementById('menu_buton').contains(event.target);

  if (!isClickInsideSidebar && !isClickInsideOpenButton) {
    closeNav();
  }
});