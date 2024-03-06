/**
 * Starts the application.
 * This function greets the current user.
 */
function start() {
  greetCurrentUser();
}

/**
 * Greets the current user by displaying their first name.
 */
function greetCurrentUser() {
  /**
   * @type {HTMLElement} greetingNameContainer - The HTML container for displaying the greeting.
   */
  let greetingNameContainer = document.getElementById("greetingNameContainer");
  greetingNameContainer.innerHTML = getCurrentUser().firstName;
}
