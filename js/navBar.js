/**
 * Initializes the application.
 * This function includes HTML files, highlights the active side button,
 * gets the current user, and shows the user navigation bar.
 * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
 */
async function init() {
  await includeHTML();
  highlightActiveSideButton();
  currentUser = getCurrentUser();
  showUserNavBar();
  ifLoggedOutHideMenuButtons();
}

/**
 * Includes HTML files dynamically into the DOM.
 * @returns {Promise<void>} A Promise that resolves when HTML files are included.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * Highlights the active side button based on the current page.
 */
function highlightActiveSideButton() {
  let activeButtonName = getCurrentPage() + "Button";
  let activeButton = document.getElementById(activeButtonName);

  if (activeButton) {
    activeButton.classList.remove("menuButton");
    activeButton.classList.add("selectedMenuButton");
  }
}

/**
 * Retrieves the current page name.
 * @returns {string} The name of the current page.
 */
function getCurrentPage() {
  let path = window.location.pathname;
  let currentPage = path.split("/").pop();
  currentPage = currentPage.split(".")[0];
  return currentPage;
}
/**
 * Opens the specified page.
 * @param {string} page - The name of the page to be opened.
 */
function openPage(page) {
  window.location.href = page + '.html';
}

/**
* Hides the menu buttons container.
*/
function hideMenuButtons() {
let menuButtonContainer = document.getElementById('menuButtonContainer');
menuButtonContainer.classList.add('d-none');
}

/**
* Hides the user icon in the navigation bar if the user is logged out.
* This function checks the login status from the local storage and hides the user icon if the user is not logged in.
*/
function ifLoggedOutHideMenuButtons() {
let loggInStatus = localStorage.getItem('loggedIn');
if (loggInStatus === "false") {
  hideMenuButtons();
}
}
