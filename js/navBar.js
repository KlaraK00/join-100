/**
 * Initializes the application.
 * This function includes HTML files, highlights the active side button,
 * gets the current user, and shows the user navigation bar.
 */
async function init() {
  await includeHTML();
  highlightActiveSideButton();
  currentUser = getCurrentUser();
  showUserNavBar();
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
