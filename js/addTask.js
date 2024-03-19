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
  // Validation logic
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

// /**
//  * Collects subtasks from the UI list and prepares them for inclusion in the task object.
//  * @returns {Array} An array of subtask objects, each containing the subtask text and a done flag.
//  */
// function collectSubtasks() {
//   let subtasksListElement = document.getElementById("subtasksList");
//   return Array.from(subtasksListElement.querySelectorAll("li")).map((li) => ({
//     subtask: li.textContent.trim(),
//     done: false,
//   }));
// }

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
    return; // Early return if validation fails
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

  pushTask(task); // Assumes pushTask only pushes the task to an array and doesn't handle localStorage
  setItem("tasks", JSON.stringify(tasks)); // Assuming setItem handles updating localStorage

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
  // Define an object mapping the button IDs to their priorities
  const priorities = {
    urgent: "urgent",
    medium: "medium",
    low: "low",
  };

  // Loop through each priority and check if its associated button is active
  for (const [key, value] of Object.entries(priorities)) {
    const button = document.getElementById(key);
    if (button && button.style.color === "white") {
      // Assuming active state is indicated by text color
      return value;
    }
  }

  // Return an empty string if no priority button is active
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
  // Clear selected contacts array and update their display
  updateAssignContactInput();
  selectedContacts = [];
  updateContactsDropdown(contacts);

  // Clear the list of subtasks
  addTasksSubtasks = [];
  renderAddTaskEditSubtasks();

  // Clear all other input fields
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due").value = "";
  document.getElementById("category").value = ""; // Assumes first option is a placeholder or default selection
  document.getElementById("addTaskInputSubtasks").value = "";

  // Optionally, reset any visual feedback on priority selection (not implemented here)
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

/**
 * Creates a checkbox image for a contact element.
 * @param {Object} contact - The contact object to determine if it is selected.
 * @returns {HTMLElement} - The checkbox image element.
 */
function createCheckboxImage(contact) {
  const checkboxImg = document.createElement("img");
  checkboxImg.setAttribute(
    "src",
    selectedContacts.includes(contact.createdAt)
      ? "img/checkedCheckboxWhite.png"
      : "img/checkboxNotChecked.png"
  );
  checkboxImg.className = "contact-checkbox";
  return checkboxImg;
}

/**
 * Attaches an event listener to a contact element for selection handling.
 * @param {HTMLElement} contactElement - The contact element to attach the listener to.
 * @param {Object} contact - The contact object related to the element.
 */
function attachEventListenerToContactElement(contactElement, contact) {
  contactElement.onclick = function () {
    const index = selectedContacts.indexOf(contact.createdAt);
    if (index > -1) {
      selectedContacts.splice(index, 1);
      contactElement.classList.add("d-none");
      contactElement
        .querySelector(".contact-checkbox")
        .setAttribute("src", "img/checkboxNotChecked.png");
      contactElement.classList.remove("selected");
    } else {
      selectedContacts.push(contact.createdAt);
      contactElement
        .querySelector(".contact-checkbox")
        .setAttribute("src", "img/checkedCheckboxWhite.png");
      contactElement.classList.add("selected");
      contactElement.classList.remove("d-none");
    }
    updateAssignContactInput();
  };
}

/**
 * Updates the contacts dropdown with the provided contacts.
 * @param {Array} contacts - The array of contact objects to display in the dropdown.
 */
function updateContactsDropdown(contacts) {
  const contactsDropdown = document.getElementById("contactsDropdown");
  if (contactsDropdown) {
    contactsDropdown.innerHTML = "";
  }

  contacts.forEach((contact) => {
    const contactElement = createContactElement(contact);
    attachEventListenerToContactElement(contactElement, contact);
    if (selectedContacts.includes(contact.createdAt)) {
      contactElement.classList.add("selected");
    }
    contactsDropdown.appendChild(contactElement);
  });
}
/**
 * Clears the content of the selected contacts container.
 */
function clearSelectedContactsContainer() {
  const selectedContactsContainer = document.getElementById(
    "selectedContactsContainer"
  );
  selectedContactsContainer.innerHTML = "";
}

/**
 * Creates and returns a div element displaying the contact's initials with a background color.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} A div element displaying the contact's initials.
 */
function createContactDisplayElement(contact) {
  const initialsDiv = document.createElement("div");
  initialsDiv.className = "contact-initials";
  initialsDiv.textContent = contact.initials;
  initialsDiv.style.backgroundColor = contact.color; // Use the contact's specified color
  return initialsDiv;
}

/**
 * Updates the display of selected contacts in the container.
 * Each selected contact's initials are displayed with their specific color.
 */
function updateAssignContactInput() {
  clearSelectedContactsContainer(); // First, clear the container

  const selectedContactsContainer = document.getElementById(
    "selectedContactsContainer"
  );

  // Iterate through each selected contact and add its display element to the container
  selectedContacts.forEach((contactId) => {
    const contact = contacts.find((c) => c.createdAt === contactId);
    if (contact) {
      const contactDisplayElement = createContactDisplayElement(contact);
      selectedContactsContainer.appendChild(contactDisplayElement);
    }
  });
}

let selectedCategory = "";
/**
 * Populates the category dropdown with predefined categories and sets up event listeners for each option.
 * Upon selecting a category, it updates the visible input field with the chosen category and closes the dropdown.
 */
function updateCategoryDropdown() {
  // Get the dropdown element from the DOM.
  const categoryDropdown = document.getElementById("categoryDropdown");
  // Clear existing options.
  categoryDropdown.innerHTML = "";

  // Predefined categories to be displayed in the dropdown.
  const categories = ["Technical Task", "User Story"];

  // Create and append a div element for each category.
  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category-option");
    categoryElement.textContent = category;

    // Set up click event listener for each category option.
    categoryElement.onclick = function () {
      // Update the globally selected category variable.
      selectedCategory = category;
      // Update the visible input field with the selected category.
      document.querySelector(".category-input").value = category;
      // Close the dropdown after selection.
      toggleCategoryDropdown();
    };

    // Append the newly created category option to the dropdown.
    categoryDropdown.appendChild(categoryElement);
  });
}

/**
 * Toggles the visibility of the category dropdown and rotates the arrow icon accordingly.
 * When the dropdown is opened, the arrow icon is rotated 180 degrees to indicate the open state.
 * When closed, the arrow is returned to its original position.
 */
function toggleCategoryDropdown() {
  // Reference to the dropdown and arrow icon elements.
  const dropdown = document.getElementById("categoryDropdown");
  const arrowImage = document.getElementById("arrow2");

  // Check the current display state of the dropdown.
  if (dropdown.style.display === "none" || !dropdown.style.display) {
    // If hidden, show the dropdown and rotate the arrow icon.
    dropdown.style.display = "block";
    arrowImage.classList.add("rotate-180");
  } else {
    // If shown, hide the dropdown and revert the arrow icon rotation.
    dropdown.style.display = "none";
    arrowImage.classList.remove("rotate-180");
  }
}

/**
 * Initializes contact-related event listeners including input filtering, focus, and dropdown toggling.
 */
function attachContactEventListeners() {
  const assignContactInput = document.querySelector(".assignContact");
  const dropdown = document.getElementById("contactsDropdown");
  // Existing event listeners
  assignContactInput.addEventListener("focus", toggleContactsDropdown);

  assignContactInput.addEventListener("input", filterContactOptions);

  document
    .querySelector(".contactInput img")
    .addEventListener(
      "click",
      stopPropagationAndToggle.bind(null, toggleContactsDropdown)
    );

  // New event listener for closing the dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !dropdown.contains(event.target) &&
      !assignContactInput.contains(event.target) &&
      !event.target.matches(".contactInput img")
    ) {
      toggleDropdownOpen(dropdown, false); // Ensure the dropdown is closed
    }
  });
}

function toggleDropdownOpen(dropdown, open = null) {
  const arrowId = "arrow";
  // If 'open' is explicitly set, use it to show/hide the dropdown
  if (open !== null) {
    dropdown.classList.toggle("show", open);
    rotateArrow(arrowId, dropdown.classList.contains("show"));
  } else {
    // Otherwise, just toggle the current state
    dropdown.classList.toggle("show");
  }
}

/**
 * Filters contact options based on the input value.
 * @param {Event} event - The input event triggering the filter.
 */
function filterContactOptions(event) {
  const searchTerm = event.target.value.toLowerCase();
  document.querySelectorAll(".contact-option").forEach((option) => {
    const contactId = option.getAttribute("data-contact-id");
    const contact = contacts.find((c) => c.createdAt.toString() === contactId);
    option.classList.toggle(
      "d-none",
      !(
        contact &&
        (contact.firstName.toLowerCase().includes(searchTerm) ||
          contact.lastName.toLowerCase().includes(searchTerm))
      )
    );
  });
  toggleDropdownOpen(document.getElementById("contactsDropdown"));
}

/**
 * Initializes category selection related event listeners.
 */
function attachCategoryEventListeners() {
  document
    .querySelector(".categoryInput img")
    .addEventListener(
      "click",
      stopPropagationAndToggle.bind(null, toggleCategoryDropdown)
    );
}

/**
 * Initializes subtask addition event listeners for both click and keypress events.
 */
function attachSubtaskEventListeners() {
  let plus = document.getElementById("plus");
  if(plus) {
    plus.addEventListener("click", handleAddSubtaskClick);
  }
  let subtasks = document.getElementById("subtasks");
  if(subtasks) {
    subtasks.addEventListener("keypress", handleAddSubtaskKeypress);
  }
}

/**
 * Initializes date input related event listeners for validation and auto-formatting.
 */
function attachDateEventListeners() {
  document.getElementById("due").addEventListener("blur", autoFormatDate);
}

/**
 * Toggles the display of a dropdown based on focus.
 * @param {HTMLElement} dropdown - The dropdown element to toggle.
 */
function toggleDropdownFocus(dropdown) {
  if (!dropdown.classList.contains("show")) dropdown.classList.add("show");
}

/**
 * Stops event propagation and executes a given toggle function.
 * @param {Function} toggleFunction - The function to execute for toggling.
 * @param {Event} event - The triggering event.
 */
function stopPropagationAndToggle(toggleFunction, event) {
  event.stopPropagation();
  toggleFunction();
}

/**
 * Handles the click event for adding a subtask.
 * @param {Event} event - The triggering event.
 */
function handleAddSubtaskClick(event) {
  event.stopPropagation();
  handleAddSubtask();
}

/**
 * Handles the keypress event for adding a subtask, specifically on Enter key press.
 * @param {Event} event - The triggering event.
 */
function handleAddSubtaskKeypress(event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
   handleAddSubtask();
  }
}

/**
/**
 * Automatically formats the date input field value upon losing focus and validates it.
 */
function autoFormatDate(event) {
  // Auto-formatting logic as before
  let value = event.target.value.replace(/[\.\-\/]/g, "");

  if (value.length > 2 && value.length <= 4)
    value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 4)
    value =
      value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);

  event.target.value = value;

  // Trigger validation after formatting
  isValidDateInput(event);
}

function initializeEventListeners() {
  attachContactEventListeners();
  attachCategoryEventListeners();
  attachSubtaskEventListeners();
  attachDateEventListeners();
  
}

// Function to handle adding a subtask from input or click event
/**
 * Handles the addition of a new subtask to the subtasks list.
 * Gets the subtask text from the input field, adds it to the list,
 * and clears the input field.
 */
function handleAddSubtask() {
    const subtasksInput = document.getElementById("subtasks");
    const subtaskText = subtasksInput.value.trim();
  
    if (subtaskText) {
      addSubtaskToList(subtaskText);
      subtasksInput.value = ""; // Clear input field
    }
  }
  
/**
 * Creates a wrapper div for a subtask with the given text.
 * @param {string} subtaskText - The text content of the subtask.
 * @returns {HTMLDivElement} The created subtask wrapper element.
 */
function createSubtaskWrapper(subtaskText) {
    const subtaskWrapper = document.createElement("div");
    subtaskWrapper.classList.add("subtask-wrapper");
    const li = createSubtaskListItem(subtaskText);
    const actionsDiv = createSubtaskActionsDiv();
    appendElements(subtaskWrapper, li, actionsDiv);
    return subtaskWrapper;
  }
  
  /**
 * Creates a list item for the subtask text.
 * @param {string} subtaskText - The text content of the subtask.
 * @returns {HTMLLIElement} The created subtask list item element.
 */
  function createSubtaskListItem(subtaskText) {
    const li = document.createElement("li");
    li.textContent = subtaskText;
    li.classList.add("subtask-text");
    return li;
  }
  
/**
 * Creates a div element for the subtask actions.
 * @returns {HTMLDivElement} The created subtask actions div element.
 */
function createSubtaskActionsDiv() {
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("subtask-actions", "d-none");
    return actionsDiv;
}
  
  /**
 * Adds edit and delete action buttons to the given actions div, with associated click handlers.
 * @param {HTMLDivElement} actionsDiv - The div element to which the action buttons will be appended.
 * @param {HTMLLIElement} li - The list item element associated with the subtask.
 */
  function addEditAndDeleteActions(actionsDiv, li) {
    const editImage = createActionButton("img/edit-black.png", "edit-action", () => {
      hideActionButtons();
      openEditField(li);
    });
    const deleteImage = createActionButton("img/delete.png", "delete-action", () => {
      deleteSubtask(li);
    });
    appendElements(actionsDiv, editImage, deleteImage);
  }
  
 /**
 * Creates an action button with the specified image source, class, and click event listener.
 * @param {string} imageSrc - The source URL of the image.
 * @param {string} className - The class name to apply to the action button.
 * @param {Function} clickHandler - The function to be executed when the button is clicked.
 * @returns {HTMLImageElement} The created action button element.
 */
  function createActionButton(imageSrc, className, clickHandler) {
    const actionButton = document.createElement("img");
    actionButton.src = imageSrc;
    actionButton.classList.add(className);
    actionButton.addEventListener("click", clickHandler);
    return actionButton;
  }
  
  /**
 * Appends multiple child elements to a parent element.
 * @param {HTMLElement} parent - The parent element to which children will be appended.
 * @param {...HTMLElement} children - The child elements to append to the parent.
 */
  function appendElements(parent, ...children) {
    children.forEach(child => parent.appendChild(child));
  }
  
  /**
 * Shows the action buttons associated with a subtask when hovering over it.
 * @param {HTMLDivElement} subtaskWrapper - The wrapper div element for the subtask.
 * @param {HTMLDivElement} actionsDiv - The div element containing the action buttons.
 */
  function showActionButtons(subtaskWrapper, actionsDiv) {
    if (!subtaskWrapper.classList.contains("editing")) {
      actionsDiv.classList.remove("d-none");
    }
  }
  
 /**
 * Hides the action buttons associated with a subtask when not hovering over it.
 * @param {HTMLDivElement} subtaskWrapper - The wrapper div element for the subtask.
 * @param {HTMLDivElement} actionsDiv - The div element containing the action buttons.
 */
  function hideActionButtons(subtaskWrapper, actionsDiv) {
    if (!subtaskWrapper.classList.contains("editing")) {
      actionsDiv.classList.add("d-none");
    }
  }
  
  /**
 * Adds event listeners to show and hide action buttons on hovering over a subtask.
 * @param {HTMLDivElement} subtaskWrapper - The wrapper div element for the subtask.
 * @param {HTMLDivElement} actionsDiv - The div element containing the action buttons.
 */
  function addHoverEventListeners(subtaskWrapper, actionsDiv) {
    subtaskWrapper.addEventListener("mouseenter", () => showActionButtons(subtaskWrapper, actionsDiv));
    subtaskWrapper.addEventListener("mouseleave", () => hideActionButtons(subtaskWrapper, actionsDiv));
  }
  
  /**
 * Adds a subtask with the given text to the subtasks list.
 * @param {string} subtaskText - The text content of the subtask to be added.
 */
  function addSubtaskToList(subtaskText) {
    const subtasksList = document.getElementById("subtasksList");
    const subtaskWrapper = createSubtaskWrapper(subtaskText);
    const li = subtaskWrapper.querySelector(".subtask-text");
    const actionsDiv = subtaskWrapper.querySelector(".subtask-actions");
    addEditAndDeleteActions(actionsDiv, li);
    addHoverEventListeners(subtaskWrapper, actionsDiv);
    subtasksList.appendChild(subtaskWrapper);
    li.addEventListener("dblclick", () => {
        openEditField(li);
      });
  }

/**
 * Add 'editing' class to the subtask wrapper and create an edit field with options.
 * @param {HTMLElement} li - The list item element to edit.
 */
function openEditField(li) {
    // Create wrapper div for the edit field
    const wrapper = createEditFieldWrapper(li);
    
    // Create edit input field
    const editInput = createEditInput(li.textContent);
    
    // Create save, delete, and confirm buttons
    const saveButton = createImageButton("img/edit.png", "edit-btn", () => saveEdit(li, editInput.value));
    const deleteButton = createImageButton("img/delete.png", "delete-btn", () => deleteSubtask(li));
    const confirmButton = createImageButton("img/tick.png", "confirm-btn", () => saveEdit(li, editInput.value));
  
    // Append elements to the wrapper
    appendElements(wrapper, editInput, saveButton, deleteButton, confirmButton);
  
    // Clear the list item content and append the wrapper
    li.innerHTML = "";
    li.appendChild(wrapper);
}

/**
 * Create a wrapper div to hold the input field and the images.
 * @param {HTMLElement} li - The list item element.
 * @returns {HTMLElement} - The wrapper div element.
 */
function createEditFieldWrapper(li) {
    const wrapper = document.createElement("div");
    wrapper.className = "edit-field-wrapper"; // CSS class for styling
    li.closest(".subtask-wrapper").classList.add("editing");
    return wrapper;
}

/**
 * Create an input field for editing.
 * @param {string} textContent - The initial text content for the input field.
 * @returns {HTMLInputElement} - The created input element.
 */
function createEditInput(textContent) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = textContent;
    editInput.className = "edit-input"; // CSS class for styling
    return editInput;
}

/**
 * Create an image button with the given image source, class, and click event listener.
 * @param {string} imageSrc - The source URL for the image.
 * @param {string} className - The CSS class for the button.
 * @param {Function} clickHandler - The click event handler function.
 * @returns {HTMLImageElement} - The created image element.
 */
function createImageButton(imageSrc, className, clickHandler) {
    const button = document.createElement("img");
    button.src = imageSrc;
    button.className = className;
    button.addEventListener("click", clickHandler);
    return button;
}

/**
 * Save the edited value and update the list item text.
 * @param {HTMLElement} li - The list item element to save the edit for.
 * @param {string} newValue - The new value to set for the list item text.
 */
function saveEdit(li, newValue) {
    li.textContent = newValue; // Update the list item text
    li.closest(".subtask-wrapper").classList.remove("editing");
    li.addEventListener("dblclick", () => openEditField(li)); // Add double-click listener again
}

/**
 * Delete the subtask associated with the given list item.
 * @param {HTMLElement} li - The list item element to delete.
 */
function deleteSubtask(li) {
    li.closest(".subtask-wrapper").classList.remove("editing");
    li.remove(); // Remove the list item
}

/**
 * Validate the input value for a date field.
 * @param {Event} event - The input event.
 */
function isValidDateInput(event) {
    const dateString = event.target.value;
    // Validation logic remains the same, just ensure it's using dateString from the event
    // ...
}

/**
 * Hide action buttons associated with subtasks.
 */
function hideActionButtons() {
    const actionsDiv = document.querySelector(".subtask-actions");
    actionsDiv.classList.add("d-none");
}

/* ---------- Klara ---------- */

function addTaskfocusOnInputOrAddSubtask() {
  let input = document.getElementById('addTaskInputSubtasks');
  let search = input.value;
  if(search == '') {
    let addTaskInputSubtasksImg = document.getElementById('addTaskInputSubtasksImg');
    addTaskInputSubtasksImg.style.width = "40px";
    addTaskInputSubtasksImg.style.justifyContent = "space-between";
    addTaskInputSubtasksImg.style.paddingRight = "16px";
    addTaskInputSubtasksImg.innerHTML = '';
    addTaskInputSubtasksImg.innerHTML = /*html*/`<img onclick="addTaskChangeImageOnSubtaskInputToPlus()" class="width12" src="./img/boardClose.png" alt="close">
        <img onclick="addTaskEditTaskAddSubtask()" class="width14" src="./img/checkBlack.png" alt="check">
    `;
    focusOn('addTaskInputSubtasks');
  } else {
    addTaskEditTaskAddSubtask();
  }
}

function addTaskEditTaskAddSubtask() {
  let addTaskInputSubtasks = document.getElementById('addTaskInputSubtasks');
    if(addTaskInputSubtasks.value !== '') {
      addTasksSubtasks.push({
          subtask: addTaskInputSubtasks.value,
          done: false
      });
      addTaskInputSubtasks.value = '';
      // addTaskchangeImageOnSubtaskInputToPlus();
      renderAddTaskEditSubtasks();
    }
}

function renderAddTaskEditSubtasks() {
  let div = document.getElementById(`addTaskAllSubtasks`);
  div.innerHTML = '';
  for (let i = 0; i < addTasksSubtasks.length; i++) {
      let subtask = addTasksSubtasks[i];
      div.innerHTML += HTMLTemplateAddTaskEditSubtasks(i, subtask);
  }
}

function addTaskChangeImageOnSubtaskInputToPlus() {
  let addTaskInputSubtasks = document.getElementById('addTaskInputSubtasks');
    let addTaskInputSubtasksImg = document.getElementById('addTaskInputSubtasksImg');
    addTaskInputSubtasks.value = '';
    addTaskInputSubtasksImg.style.width = "48px";
    addTaskInputSubtasksImg.style.height = "48px";
    addTaskInputSubtasksImg.style.justifyContent = "center";
    addTaskInputSubtasksImg.style.paddingRight = "0";
    addTaskInputSubtasksImg.style.top = "0";
    addTaskInputSubtasksImg.style.right = "0";
    addTaskInputSubtasksImg.innerHTML = '';
    addTaskInputSubtasksImg.innerHTML = /*html*/`<img onclick="addTaskfocusOnInputOrAddSubtask()" class="height16" src="./img/add-2.png" alt="plus">`;
}

function addTaskEditTaskSubtask(i) {
  let addTaskSubtaskParent = document.getElementById(`addTaskSubtaskParent${i}`);
  addTaskSubtaskParent.classList.remove('hoverGrey');
  addTaskSubtaskParent.innerHTML = '';
  addTaskSubtaskParent.innerHTML = HTMLTemplateAddTaskEditSubtasksEdit(i);
}

function addTaskaddSubtaskOnEnter(event) {
  if(event.keyCode == 13) {
    event.preventDefault();
    addTaskEditTaskAddSubtask();
  }
}

/**
 * Adds blue border to a specific element.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function addTaskSetBlueBorderBottom(i) {
  let addTaskSubtaskParent = document.getElementById(`addTaskSubtaskParent${i}`);
  addTaskSubtaskParent.classList.add('blueBorderBottom');
}

/**
 * Removes the blue border from a specific element.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function addTaskRemoveBlueBorderBottom(i) {
  let addTaskSubtaskParent = document.getElementById(`addTaskSubtaskParent${i}`);
  addTaskSubtaskParent.classList.remove('blueBorderBottom');
}

function addTaskEditSubtaskInputValue(i) {

}

/**
 * Sets the value for a specific subtask.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function addTaskEditSubtaskInputValue(i) {
  let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
  addTasksSubtasks[i].subtask = editEditSubtaskInput.value;
  renderAddTaskEditSubtasks();
}