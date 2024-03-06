function togglePopUpMenu() {
    let popUpMenu = document.getElementById("popUpUser");
    let closePopUpContentContainer = document.getElementById("closePopUpContentContainer");
  
    if (popUpMenu.style.display === "flex") {
      closePopUpMenu(popUpMenu, closePopUpContentContainer);
    } else {
      openPopUpMenu(popUpMenu, closePopUpContentContainer);
    }
  }
  
  function openPopUpMenu(popUpMenu, closePopUpContentContainer) {
    popUpMenu.style.display = "flex";
    closePopUpContentContainer.style.display = "flex";
  }
  
  function closePopUpMenu(popUpMenu, closePopUpContentContainer) {
    popUpMenu.style.display = "none";
    closePopUpContentContainer.style.display = "none";
  }
  