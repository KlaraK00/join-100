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
/**
 * Displays the user navigation bar icon.
 */
function showUserNavBar() {
  /**
   * @type {HTMLElement} iconElipse - The HTML element representing the icon.
   */
  let iconElipse = document.getElementById('iconElipse');
  iconElipse.innerHTML = getFirstTwoLetters(currentUser);
}

/**
 * Returns the first two letters of the user's first and last name.
 * @param {Object} element - The user element from which initials are to be taken.
 * @returns {string} The first two letters of the user's first and last name.
 */
function getFirstTwoLetters(element) {
  /**
   * @type {string} firstLetterOfFirstName - The first letter of the user's first name.
   */
  let firstLetterOfFirstName = element.firstName.charAt(0);
  /**
   * @type {string} firstLetterOfLastName - The first letter of the user's last name, if present.
   */
  let firstLetterOfLastName = '';
  if(lastNameExists(element)) {
    firstLetterOfLastName = element.lastName.charAt(0);
  }
  return `${firstLetterOfFirstName}${firstLetterOfLastName}`;
}

/**
 * Checks if a last name exists in the user element.
 * @param {Object} element - The user element to be checked.
 * @returns {boolean} True if a last name exists, otherwise false.
 */
function lastNameExists(element) {
  return element.lastName && element.lastName !== '';
}

/**
 * Hides the user icon in the navigation bar if the user is logged out.
 * This function checks the login status from the local storage and hides the user icon if the user is not logged in.
 */
function ifLoggedOutHideUserIcon() {
  let loggInStatus = localStorage.getItem('loggedIn');

  
  if (loggInStatus === "false") {
    let userIcon = document.getElementById('userNavar');
    let helpContainer = document.getElementById('helpContainer');
    let menuButtonContainer = document.getElementById('menuButtonContainer');
    userIcon.classList.add('d-none');
    helpContainer.classList.add('d-none');
    menuButtonContainer.classList.add('d-none');
  }
}
