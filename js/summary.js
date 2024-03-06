/**
 * Starts the application.
 * This function greets the current user.
 */
function start() {
  greetCurrentUser();
}

/**
 * Greets the current user by displaying their first name along with a greeting based on the time of the day.
 */
function greetCurrentUser() {
  /**
   * @type {HTMLElement} greetingContainer - The HTML container for displaying the greeting.
   */
  let greetingContainer = document.getElementById("greeting");
  let greeting = generateGreeting();
  let nameContainer = document.getElementById("greetingNameContainer");
  nameContainer.textContent = getCurrentUser().firstName;
  greetingContainer.textContent = greeting;
}

/**
 * Generates a greeting based on the time of the day.
 * @returns {string} The generated greeting.
 */
function generateGreeting() {
  let date = new Date();
  let hour = date.getHours();
  let greeting = "";
  
  if (hour < 12) {
    greeting = "Good morning, ";
  } else if (hour < 18) {
    greeting = "Good afternoon, ";
  } else {
    greeting = "Good evening, ";
  }

  return greeting;
}
