let tasks = [];
let selectedContacts = [];
let TaskStatus = {
  TODO: "toDo",
  IN_PROGRESS: "inProgress",
  AWAIT_FEEDBACK: "awaitFeedback",
  DONE: "done",
};
let currentStatus = "toDo";
let addTasksSubtasks = [];

/**
 * Initializes the application by loading HTML templates and then setting up tasks.
 * This function ensures that the HTML templates are fully loaded before initializing task-related functionalities.
 * It should be called when the document is ready to ensure all DOM elements are available.
 */
async function initApp() {
  await includeHTML();
  initAddTask();
}

/**
 * Initializes task-related functionalities after user login validation.
 * Loads tasks, contacts, and users data, updates UI elements accordingly,
 * and attaches relevant event listeners.
 */
async function initAddTask() {
  loadLoggedIn();
  if (loggedIn) {
    await loadTasks();
    await loadContacts();
    await loadUsers();
    currentStatus = "toDo"; // Default status for new tasks
    addTasksSubtasks = [];
    updateContactsDropdown(contacts); // Update contacts dropdown UI
    highlightActiveSideButton(); // Highlight the active sidebar button
    currentUser = getCurrentUser(); // Get current user information
    showUserNavBar(); // Show the user-specific navigation bar
    initializeEventListeners(); // Attach necessary event listeners
    updateCategoryDropdown(); // Update the category dropdown UI
    widthSubtasks();
  } else {
    showLogInError(); // Show an error if login validation fails
  }
}

/**
 * Asynchronously loads tasks from storage if they exist.
 * Updates the global `tasks` array with the fetched tasks.
 */
async function loadTasks() {
  if (await tasksExist()) {
    tasks = JSON.parse(await getItem("tasks"));
  }
}

/**
 * Checks asynchronously if tasks exist in storage.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if tasks exist, otherwise false.
 */
async function tasksExist() {
  return (await getItem("tasks")) !== null;
}

/**
 * Retrieves the value of an HTML element by its ID.
 *
 * @param {string} id - The ID of the HTML element.
 * @returns {string} The value of the specified HTML element.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Creates a task object with provided parameters.
 * @param {number} createdAt - The timestamp when the task was created.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {Array<string>} contacts - An array of contact IDs assigned to the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @param {string} category - The category of the task.
 * @param {Array<Object>} subtasks - An array of subtasks, each represented by an object.
 * @param {string} status - The current status of the task.
 * @returns {Object} A new task object.
 */
function createTaskObject(
  createdAt,
  title,
  description,
  contacts,
  date,
  prio,
  category,
  subtasks,
  status
) {
  return {
    createdAt,
    title,
    description,
    contacts,
    date,
    prio,
    category,
    subtasks,
    status
  };
}

/**
 * Adds a task to the tasks array and updates the local storage with the new array.
 * @param {Object} task - The task object to be added to the tasks array.
 */
function pushTask(task) {
  tasks.push(task);
  setItem("tasks", JSON.stringify(tasks)); // Update local storage with the new tasks array
}

/**
 * Validates the necessary task data (title and due date).
 * @param {string} title - The task title.
 * @param {string} dueDate - The due date of the task.
 * @returns {boolean} True if both title and due date are not empty, false otherwise.
 */
function validateTaskData(title, date) {
  return title.trim() && date.trim();
}

/**
 * Converts the due date format from dd/mm/yyyy to yyyy-mm-dd.
 * @param {string} dueDateOriginalFormat - The original due date string in dd/mm/yyyy format.
 * @returns {string} The due date in yyyy-mm-dd format.
 */
function convertDueDateFormat(dueDateOriginalFormat) {
  let dueDateParts = dueDateOriginalFormat.split("/");
  return `${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`;
}

/**
 * Prepares the task object with all the necessary data.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {Array} contacts - The assigned contacts for the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} priority - The task priority.
 * @param {string} category - The task category.
 * @param {Array} subtasks - The list of subtasks for the task.
 * @returns {Object} The prepared task object.
 */
function prepareTaskObject(
  title,
  description,
  contacts,
  date,
  prio,
  category,
  subtasks
) {
  let createdAt = new Date().getTime();
  let status = currentStatus;
  return {
    createdAt,
    title,
    description,
    contacts,
    date,
    prio,
    category,
    subtasks,
    status
  };
}

/**
 * Performs final steps after a task is created, such as clearing inputs and optionally closing the task overlay and rendering all tasks (if on the board page).
 */
function finalizeTaskCreation() {
  clearInput();
  if (window.location.href.includes("board")) {
    setTimeout(() => {
      closeTask();
      renderAllTasks();
    }, 2000);
  }
}

/**
 * Creates a task based on user input from the UI, validates data, prepares the task object, and updates the tasks list.
 */
function createTask() {
  let title = getInputValue("title");
  let dueDateOriginalFormat = getInputValue("due");
  let date = convertDueDateFormat(dueDateOriginalFormat);

  if (!validateTaskData(title, date)) {
    return;
  }

  let description = getInputValue("description");
  let contacts = selectedContacts;
  let prio = getRightPriority();
  let category = getInputValue("category");
  let subtasks = addTasksSubtasks;

  let task = prepareTaskObject(
    title,
    description,
    contacts,
    date,
    prio,
    category,
    subtasks
  );

  pushTask(task);
  setItem("tasks", JSON.stringify(tasks)); 

  selectedContacts = [];
  finalizeTaskCreation();
  clearInput();
  showSuccessBanner();
}

function showSuccessBanner() {
  if(window.location.href.includes("board")) {
    let successBanner = document.getElementById('successBannerBoard');
    successBanner.classList.remove('d-none');
  
    setTimeout(function() {
      successBanner.classList.add('d-none');
    }, 3000);
  } else {
    let successBanner = document.getElementById('successBanner');
    successBanner.classList.remove('d-none');

    setTimeout(function() {
      successBanner.classList.add('d-none');
    }, 3000);
  }
}

function getRightPriority() {
  if (getPriority() == '') {
    return 'medium';
  } else {
    return getPriority();
  }
}

/**
 * Retrieves the priority of the task based on the active priority button.
 * It checks which button has an active state and returns the corresponding priority.
 *
 * @returns {string} The priority of the task. Possible values are "urgent", "medium", "low".
 * If no priority button is active, it returns an empty string indicating no priority has been set.
 */
function getPriority() {
  const priorities = {
    urgent: "urgent",
    medium: "medium",
    low: "low",
  };

  for (const [key, value] of Object.entries(priorities)) {
    const button = document.getElementById(key);
    if (button && button.style.color === "white") {
      return value;
    }
  }

  return "";
}

/**
Activates the selected button, changes the background color according to the priority, sets the filter for the images, and modifies the font color of the buttons.
@param {string} priority - The priority of the selected button ('urgent', 'medium', or 'low').
*/
function activateButton(priority) {
  document.getElementById("urgent").style.backgroundColor = "white";
  document.getElementById("medium").style.backgroundColor = "white";
  document.getElementById("low").style.backgroundColor = "white";
  document.getElementById("urgent").querySelector("img").style.filter = "none";
  document.getElementById("medium").querySelector("img").style.filter = "none";
  document.getElementById("low").querySelector("img").style.filter = "none";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";

  switch (priority) {
    case "urgent":
      document.getElementById("urgent").style.backgroundColor =
        "rgb(255, 62, 0)";
      document.getElementById("urgent").querySelector("img").style.filter =
        "brightness(0) invert(1)";
      document.getElementById("urgent").style.color = "white";
      break;
    case "medium":
      document.getElementById("medium").style.backgroundColor =
        "rgb(255, 168, 0)";
      document.getElementById("medium").querySelector("img").style.filter =
        "brightness(0) invert(1)";
      document.getElementById("medium").style.color = "white";
      break;
    case "low":
      document.getElementById("low").style.backgroundColor =
        "rgb(123, 226, 40)";
      document.getElementById("low").querySelector("img").style.filter =
        "brightness(0) invert(1)";
      document.getElementById("low").style.color = "white";
      break;
  }
}

/**
 * Clears all input fields in the task form, resets selected contacts and updates their display.
 * This function is intended to be called after a task is successfully created or when the user
 * wishes to reset the form to its initial state.
 */
function clearInput() {
  updateAssignContactInput();
  selectedContacts = [];
  updateContactsDropdown(contacts);

  addTasksSubtasks = [];
  renderAddTaskEditSubtasks();

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due").value = "";
  document.getElementById("category").value = "";
  document.getElementById("addTaskInputSubtasks").value = "";

}

function toggleContactsDropdown() {
  const dropdown = document.getElementById("contactsDropdown");
  const arrowId = "arrow";
  dropdown.classList.toggle("show");
  rotateArrow(arrowId, dropdown.classList.contains("show"));
}

function rotateArrow(arrowId, isOpen) {
  const arrowImage = document.getElementById(arrowId);
  if (isOpen && arrowImage) {
    arrowImage.classList.add("rotate-180");
  } else if (arrowImage) {
    arrowImage.classList.remove("rotate-180");
  }
}

/**
 * Creates an HTML element representing a contact.
 * @param {Object} contact - The contact object containing the contact's details.
 * @returns {HTMLElement} - The contact element ready to be inserted into the DOM.
 */
function createContactElement(contact) {
  const contactElement = document.createElement("div");
  contactElement.classList.add("contact-option");
  contactElement.setAttribute("data-contact-id", contact.createdAt);

  const nameContainer = document.createElement("div");
  nameContainer.classList.add("name-container-add-task");

  const initialsSpan = document.createElement("span");
  initialsSpan.className = "contact-initials";
  initialsSpan.textContent = contact.initials;
  initialsSpan.style.backgroundColor = contact.color;

  const nameTextSpan = document.createElement("span");
  nameTextSpan.textContent = ` ${contact.firstName} ${contact.lastName}`;

  nameContainer.appendChild(initialsSpan);
  nameContainer.appendChild(nameTextSpan);

  const checkboxImg = createCheckboxImage(contact);
  contactElement.appendChild(nameContainer);
  contactElement.appendChild(checkboxImg);

  return contactElement;
}