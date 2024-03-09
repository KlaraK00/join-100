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

function countTasksByStatus() {
  const doneTasksCount = tasks.filter((task) => task.status === "done").length;
  const inProgressTasksCount = tasks.filter(
    (task) => task.status === "inProgress"
  ).length;
  const toDoTasksCount = tasks.filter((task) => task.status === "toDo").length;
  const awaitingFeedbackTasksCount = tasks.filter(
    (task) => task.status === "awaitFeedback"
  ).length;
  const urgentFeedbackTasksCount = tasks.filter(
    (task) => task.status === "urgent"
  ).length;
  return {
    done: doneTasksCount,
    inProgress: inProgressTasksCount,
    toDo: toDoTasksCount,
    awaitingFeedback: awaitingFeedbackTasksCount,
    urgent: urgentFeedbackTasksCount,
  };
}

function addTasksStatusLengthToSummary() {
  const taskCounts = countTasksByStatus();
  let doneTaskCountContainer = document.getElementById("done");
  let inProgressTaskCountContainer = document.getElementById("progress");
  let toDoTaskCountContainer = document.getElementById("toDoContainer");
  let awaitingFeedbackTaskCountContainer = document.getElementById("await");
  let urgentFeedbackTaskCountContainer = document.getElementById("urgent");
  let tasksInBoardTaskContainer = document.getElementById("boardTasks");
  let allOpenTasks =
    taskCounts.done +
    taskCounts.inProgress +
    taskCounts.toDo +
    taskCounts.awaitingFeedback +
    taskCounts.urgent;
  doneTaskCountContainer.innerHTML = taskCounts.done;
  inProgressTaskCountContainer.innerHTML = taskCounts.inProgress;
  toDoTaskCountContainer.innerHTML = taskCounts.toDo;
  awaitingFeedbackTaskCountContainer.innerHTML = taskCounts.awaitingFeedback;
  urgentFeedbackTaskCountContainer.innerHTML = taskCounts.urgent;
  tasksInBoardTaskContainer.innerHTML = allOpenTasks;
}

function showLogInError() {
  document.body.innerHTML = 'sorry for loading error';
}

function setFirstVisitSummaryTrue() {
  localStorage.setItem("summaryFirstVisit", true);
}

function setFirstVisitSummaryFalse() {
  localStorage.setItem("summaryFirstVisit", false);
}

function mobileGreetAnimation() {
  let firstVisitvalueFromLocalStorage =
    localStorage.getItem("summaryFirstVisit");

  let convertedBooleanValue = JSON.parse(firstVisitvalueFromLocalStorage);
  if (convertedBooleanValue === true) {
    let greetContainer = document.getElementById("greetContainer");
    let flexContainer = document.getElementById("flexContainer");
    let headline = document.getElementById("headline");
    if (window.innerWidth <= 1100) {
      greetContainer.classList.remove("greet-container");
      greetContainer.classList.add("mobileGreetAnimation");
      // flexContainer.classList.add('d-none');
      // headline.classList.add('d-none');
      setTimeout(function () {
        greetContainer.classList.remove("mobileGreetAnimation");
        greetContainer.classList.add("d-none");
        flexContainer.classList.remove("d-none");
        headline.classList.remove("d-none");
        setFirstVisitSummaryFalse(); // Setze summaryFirstVisit auf false, wenn der Timeout abgelaufen ist
      }, 4000);
    } else {
      // Setze summaryFirstVisit auf false, wenn das Fenster breiter als 1100 Pixel ist
      setFirstVisitSummaryFalse();
      flexContainer.classList.remove("d-none");
      headline.classList.remove("d-none");
    }
  } else {
    flexContainer.classList.remove("d-none");
    headline.classList.remove("d-none");
  }
}

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
