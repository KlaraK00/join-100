function start() {
  greetCurrentUser();
}

function greetCurrentUser() {
  let greetingNameContainer = document.getElementById("greetingNameContainer");
  greetingNameContainer.innerHTML = getCurrentUser().firstName;
}
