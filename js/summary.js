/**
 * Starts the application.
 * This function greets the current user.
 */
async function start() {
  loadCurrentUser();
  loadLoggedIn();
  if(loggedIn) {
    await init();
    mobileGreetAnimation();
    displayMainContentOnNormalScreenSize();
    await loadTasks();
    greetCurrentUser();
    addTasksStatusLengthToSummary();
  } else {
    showLogInError();
  }
}

// ##############################################

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

// ##############################################
function countTasksByStatus() {
  const doneTasksCount = tasks.filter((task) => task.status === "done").length;
  const inProgressTasksCount = tasks.filter((task) => task.status === "inProgress").length;
  const toDoTasksCount = tasks.filter((task) => task.status === "toDo").length;
  const awaitingFeedbackTasksCount = tasks.filter((task) => task.status === "awaitFeedback").length;
  const urgentFeedbackTasksCount = tasks.filter((task) => task.status === "urgent").length;
  return {
    done: doneTasksCount,
    inProgress: inProgressTasksCount,
    toDo: toDoTasksCount,
    awaitingFeedback: awaitingFeedbackTasksCount,
    urgent: urgentFeedbackTasksCount,
  };
}

/**
 * Fügt die Aufgabenstatuslängen der Zusammenfassung hinzu.
 */
function addTasksStatusLengthToSummary() {
  const taskCounts = countTasksByStatus();
  const elements = getTaskCountContainers();
  updateTaskStatusLength(taskCounts, elements);
}

/**
 * Ruft die Container-Elemente für die Aufgabenstatuslängen ab.
 * @returns {Object} Ein Objekt mit den Container-Elementen für die Aufgabenstatuslängen.
 */
function getTaskCountContainers() {
  return {
    done: document.getElementById("done"),
    inProgress: document.getElementById("progress"),
    toDo: document.getElementById("toDoContainer"),
    awaitingFeedback: document.getElementById("await"),
    urgentFeedback: document.getElementById("urgent"),
    tasksInBoard: document.getElementById("boardTasks")
  };
}

/**
 * Aktualisiert die Aufgabenstatuslängen in den entsprechenden HTML-Containern.
 * @param {Object} taskCounts - Ein Objekt, das die Anzahl der Aufgaben nach Status enthält.
 * @param {Object} elements - Ein Objekt mit den Container-Elementen für die Aufgabenstatuslängen.
 */
function updateTaskStatusLength(taskCounts, elements) {
  const allOpenTasks = taskCounts.done + taskCounts.inProgress + taskCounts.toDo + taskCounts.awaitingFeedback + taskCounts.urgent;
  elements.done.innerHTML = taskCounts.done;
  elements.inProgress.innerHTML = taskCounts.inProgress;
  elements.toDo.innerHTML = taskCounts.toDo;
  elements.awaitingFeedback.innerHTML = taskCounts.awaitingFeedback;
  elements.urgentFeedback.innerHTML = taskCounts.urgent;
  elements.tasksInBoard.innerHTML = allOpenTasks;
}

// ##############################################



function showLogInError() {
  document.body.innerHTML = 'sorry for loading error';
}

// ##############################################
/**
 * Sets the value in localStorage to true to indicate that the summary is first visited.
 */
function setFirstVisitSummaryTrue() {
  localStorage.setItem("summaryFirstVisit", true);
}

/**
 * Sets the value in localStorage to false to indicate that the summary is no longer first visited.
 */
function setFirstVisitSummaryFalse() {
  localStorage.setItem("summaryFirstVisit", false);
}

/**
 * Retrieves the DOM elements for the summary animation.
 * @returns {Object} An object containing the DOM elements for the greet container, flex container, and headline.
 */
function getSummaryAnimationElements() {
  const greetContainer = document.getElementById("greetContainer");
  const flexContainer = document.getElementById("flexContainer");
  const headline = document.getElementById("headline");
  return { greetContainer, flexContainer, headline };
}

/**
 * Retrieves the value from localStorage and parses it into a boolean value.
 * @returns {boolean} The boolean value indicating whether the summary is first visited.
 */
function getFirstVisitvalueFromLocalStorage() {
  let firstVisitvalueFromLocalStorage = localStorage.getItem("summaryFirstVisit");
  return JSON.parse(firstVisitvalueFromLocalStorage);
}

/**
 * Removes the CSS class for the mobile greet animation and adds the CSS class for the normal greet animation.
 * @param {HTMLElement} greetContainer - The greet container.
 */
function removeNormalAndAddMobileGreetClasslists(greetContainer) {
  greetContainer.classList.remove("greet-container");
  greetContainer.classList.add("mobileGreetAnimation");
}

/**
 * Removes the CSS class for the mobile greet animation and adds the CSS class for hiding the element.
 * @param {HTMLElement} greetContainer - The greet container.
 */
function removeMobileAndAddNormalGreetClasslists(greetContainer) {
  greetContainer.classList.remove("mobileGreetAnimation");
  greetContainer.classList.add("d-none");
}

/**
 * Shows the main content by removing the CSS classes for hiding the flex container and headline.
 * @param {HTMLElement} flexContainer - The flex container.
 * @param {HTMLElement} headline - The headline.
 */
function showSummaryContent(flexContainer, headline) {
  flexContainer.classList.remove("d-none");
  headline.classList.remove("d-none");
}

/**
 * Performs the necessary steps to finalize the summary display.
 * @param {HTMLElement} greetContainer - The greet container.
 * @param {HTMLElement} flexContainer - The flex container.
 * @param {HTMLElement} headline - The headline.
 */
function finalizeSummaryDisplay(greetContainer, flexContainer, headline) {
  removeMobileAndAddNormalGreetClasslists(greetContainer);
  showSummaryContent(flexContainer, headline);
  setFirstVisitSummaryFalse();
}

/**
 * Checks the localStorage value and displays the summary animation if necessary.
 */
function mobileGreetAnimation() {
  const { greetContainer, flexContainer, headline } = getSummaryAnimationElements();
  if (getFirstVisitvalueFromLocalStorage() === true) {
    if (window.innerWidth <= 1100) {
      removeNormalAndAddMobileGreetClasslists(greetContainer);
      setTimeout(function () {
        finalizeSummaryDisplay(greetContainer, flexContainer, headline);
      }, 4000);
    } else {
      setFirstVisitSummaryFalse();
      showSummaryContent(flexContainer, headline);
    }
  } else {
    showSummaryContent(flexContainer, headline);
  }
}

/**
 * Displays the main content when the screen size is normal (greater than or equal to 1100).
 */
function displayMainContentOnNormalScreenSize() {
  let greetContainer = document.getElementById("greetContainer");
  let flexContainer = document.getElementById("flexContainer");
  let headline = document.getElementById("headline");
  if (window.innerWidth >= 1100) {
    flexContainer.classList.remove("d-none");
    greetContainer.classList.remove("d-none");
    headline.classList.remove("d-none");
  }
}

// ##############################################