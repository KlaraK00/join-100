let tasks = [];
const TaskStatus = {
    TODO: "toDo",
    IN_PROGRESS: "inProgress",
    AWAIT_FEEDBACK: "awaitFeedback",
    DONE: "done"
  };

async function initAddTask() {
  await includeHTML();
  await loadTasks();
  await loadContacts();
  await loadUsers();
  updateContactsDropdown(contacts);
  highlightActiveSideButton();
  currentUser = getCurrentUser();
  showUserNavBar();
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
  let description = getInputValue("description");
  let assignedToDropdown = document.getElementById("assign");
  let contacts = Array.from(assignedToDropdown.selectedOptions).map(
    (option) => option.value
  );
  let dueDate = getInputValue("due");
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

function updateContactsDropdown(contacts) {
  const assignDropdown = document.getElementById("assign");
  // Clear existing options except the first preview option
  assignDropdown.innerHTML =
    '<option value="preview">Select contacts to assign</option>';

  // Iterate over the contacts array to add each contact as an option
  contacts.forEach((contact) => {
    const optionElement = document.createElement("option");
    optionElement.value = contact.createdAt;
    optionElement.textContent = `${contact.firstName} ${contact.lastName}`;
    assignDropdown.appendChild(optionElement);
  });
}

function createSubtask() {

}