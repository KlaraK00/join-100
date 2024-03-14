let tasks = [];
let editTaskContacts;
const TaskStatus = {
  TODO: "toDo",
  IN_PROGRESS: "inProgress",
  AWAIT_FEEDBACK: "awaitFeedback",
  DONE: "done",
};

async function initAddTask() {
  loadLoggedIn();
  if(loggedIn) {
    await includeHTML();
    await loadTasks();
    await loadContacts();
    await loadUsers();
    updateContactsDropdown(contacts);
    highlightActiveSideButton();
    currentUser = getCurrentUser();
    showUserNavBar();
  } else {
    showLogInError();
  }
}

async function loadTasks() {
  if (await tasksExist()) {
    tasks = JSON.parse(await getItem("tasks"));
  }
}

async function tasksExist() {
  return await getItem("tasks");
}

function getInputValue(id) {
  return document.getElementById(id).value;
}

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
    contacts, // Supports both single and multiple contact IDs
    date,
    prio,
    category,
    subtasks,
    status,
  };
}

function pushTask(task) {
  console.log(task);
  tasks.push(task);
  console.log(JSON.stringify(tasks));
}

function createTask() {
  let title = getInputValue("title");
  let dueDate = getInputValue("due");
  // Check required fields 
  if (!title.trim() || !dueDate.trim()) {
    alert("Please fill in all required fields.");
    return; // Exit the function 
  }
  let description = getInputValue("description");
  let assignedToDropdown = document.getElementById("assign");
  let contacts = Array.from(assignedToDropdown.selectedOptions)
    .map((option) => Number(option.value)) // Convert to Number
    .filter((value) => !isNaN(value) && value !== "preview"); //exlude preview from NaN
  let priority = getPriority();
  let category = getInputValue("category");
  let subtasksInput = getInputValue("subtasks");
  let subtasks = subtasksInput
    .split(",")
    .filter((subtask) => subtask.trim() !== "") // Remove any empty entries
    .map((subtask) => ({ subtask: subtask.trim(), done: false })); // Map to objects

  let createdAt = new Date().getTime();
  let task = createTaskObject(
    createdAt,
    title,
    description,
    contacts,
    dueDate,
    priority,
    category,
    subtasks,
    TaskStatus.TODO
  );

  pushTask(task);
  setItem("tasks", tasks);
}

function getPriority() {
  //access all prio buttons
  let priorityButtons = document.querySelectorAll(".prio button");
  //loop through buttons
  for (let button of priorityButtons) {
    //check for active class
    if (button.classList.contains("active")) {
      return button.textContent.trim();
    }
  }
  return "Not set";
}

function activateButton(buttonId) {
  //remove active from all buttons
  document.querySelectorAll("#priority .prio button").forEach((button) => {
    button.classList.remove("active");
  });

  //add active to the button the user clicks on
  let button = document.getElementById(buttonId);
  button.classList.add("active");
}

function clearInput() {
  location.reload();
}

// Function to toggle the visibility of the contacts dropdown
function toggleContactsDropdown() {
    const dropdown = document.getElementById('contactsDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    // Optionally, call updateContactsDropdown here if you want to populate it every time it's toggled
}

// Updated function to populate the dropdown div instead of a select element
function updateContactsDropdown(contacts) {
    const contactsDropdown = document.getElementById("contactsDropdown");
    // Clear existing content
    contactsDropdown.innerHTML = '';

    // Iterate over the contacts array to add each contact as an option
    contacts.forEach((contact) => {
        const contactElement = document.createElement("div");
        contactElement.textContent = `${contact.firstName} ${contact.lastName}`;
        contactElement.classList.add("contact-option");
        contactElement.onclick = function() {
            document.querySelector('.assignContact').value = contact.firstName + ' ' + contact.lastName; // Example action
            toggleContactsDropdown(); // Hide dropdown after selection
        };
        // Additional styles or classes for contactElement can be added here
        contactsDropdown.appendChild(contactElement);
    });
}




