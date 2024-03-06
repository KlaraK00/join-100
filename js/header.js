/**
 * Toggle the visibility of a popup menu.
 * If the menu is currently displayed, it will be hidden, otherwise, it will be shown.
 */
function togglePopUpMenu() {
  /**
   * @type {HTMLElement} popUpMenu - The popup menu element to be toggled.
   */
  let popUpMenu = document.getElementById("popUpUser");
  /**
   * @type {HTMLElement} closePopUpContentContainer - The element to close the popup content container.
   */
  let closePopUpContentContainer = document.getElementById("closePopUpContentContainer");

  if (popUpMenu.style.display === "flex") {
    closePopUpMenu(popUpMenu, closePopUpContentContainer);
  } else {
    openPopUpMenu(popUpMenu, closePopUpContentContainer);
  }
}

/**
 * Open the popup menu and the close container.
 * @param {HTMLElement} popUpMenu - The popup menu element to be opened.
 * @param {HTMLElement} closePopUpContentContainer - The element to close the popup content container.
 */
function openPopUpMenu(popUpMenu, closePopUpContentContainer) {
  popUpMenu.style.display = "flex";
  closePopUpContentContainer.style.display = "flex";
}

/**
 * Close the popup menu and the close container.
 * @param {HTMLElement} popUpMenu - The popup menu element to be closed.
 * @param {HTMLElement} closePopUpContentContainer - The element to close the popup content container.
 */
function closePopUpMenu(popUpMenu, closePopUpContentContainer) {
  popUpMenu.style.display = "none";
  closePopUpContentContainer.style.display = "none";
}



/* ---------- show User ---------- */

function showUserNavBar() {
  let iconElipse = document.getElementById('iconElipse');
  iconElipse.innerHTML = getFirstTwoLetters(currentUser);
}

function getFirstTwoLetters(element) {
  let firstLetterOfFirstName = element.firstName.charAt(0);
  let firstLetterOfLastName = '';
  if(lastNameExists(element)) {
    firstLetterOfLastName = element.lastName.charAt(0);
  }
  return `${firstLetterOfFirstName}${firstLetterOfLastName}`;
}

function lastNameExists(element) {
  return element.lastName && element.lastName !== '';
}