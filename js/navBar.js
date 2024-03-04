async function init() {
  await loadContacts();
  await includeHTML();
  highlightActiveSideButton();
  currentUser = getCurrentUser();
  showUserNavBar();
}

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

function highlightActiveSideButton() {
  let activeButtonName = getCurrentPage() + "Button";
  let activeButton = document.getElementById(activeButtonName);
  console.log('buttoname =', activeButton);

  if (activeButton) {
    activeButton.classList.remove("menuButton");
    activeButton.classList.add("selectedMenuButton");
  }
}

function getCurrentPage() {
  let path = window.location.pathname;
  let currentPage = path.split("/").pop();
  currentPage = currentPage.split(".")[0];
  return currentPage;
}

function openPage(page) {
    window.location.href = page + '.html';
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