let tasks = [];
let selectedContacts = [];
let TaskStatus = {
  TODO: "toDo",
  IN_PROGRESS: "inProgress",
  AWAIT_FEEDBACK: "awaitFeedback",
  DONE: "done",
};

let currentStatus = "toDo";

async function initApp() {
  await includeHTML(); // ensures the Template is loaded
  initAddTask(); // Now safe to initialize tasks and attach event listeners
}

async function initAddTask() {
  loadLoggedIn();
  if (loggedIn) {
    await loadTasks();
    await loadContacts();
    await loadUsers();
    currentStatus = "toDo"
    updateContactsDropdown(contacts);
    highlightActiveSideButton();
    currentUser = getCurrentUser();
    showUserNavBar();
    attachInputEventListeners();
    updateCategoryDropdown() // Attach event listeners so they are called after content is loaded
  } else showLogInError();
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
  tasks.push(task);
  setItem("tasks", tasks); // Speichern des tasks-Arrays im lokalen Speicher
}

function createTask() {
  let title = getInputValue("title");
  let dueDateOriginalFormat = getInputValue("due");
  // Convert dueDate from dd/mm/yyyy to yyyy-mm-dd format
  let dueDateParts = dueDateOriginalFormat.split("/");
  let dueDate = `${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`;
    if (!title.trim() || !dueDate.trim()) {
    return;
  }

  let description = getInputValue("description");

  let contacts = selectedContacts;
  let priority = getPriority();
  let category = getInputValue("category");

  //  read the subtasks from the UL list
  let subtasksListElement = document.getElementById("subtasksList");
  let subtasks = Array.from(subtasksListElement.querySelectorAll("li")).map(
    (li) => ({
      subtask: li.textContent.trim(),
      done: false, // Assuming all new subtasks are initially not done
    })
  );

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
    (TaskStatus = currentStatus)
  );

  pushTask(task);
  setItem("tasks", tasks);
  selectedContacts = [];
  clearInput();
  if(window.location.href.includes('board')) {
    closeTask();
    renderAllTasks();
  }
}

function getPriority() {
  // Define an object mapping the button IDs to their priorities
    const priorities = {
      "urgent": "urgent",
      "medium": "medium",
      "low": "low"
    };
    
    // Iterate over the priority keys (button IDs)
    for (let id of Object.keys(priorities)) {
      let button = document.getElementById(id);
      // Check if the button's text color is white
      if (button.style.color === "white") {
        return priorities[id]; // Return the corresponding priority
    }
  }
  return "";
}

/**
 * Aktiviert den ausgewählten Button, ändert die Hintergrundfarbe entsprechend der Priorität, setzt den Filter für die Bilder und ändert die Schriftfarbe der Buttons.
 * @param {string} priority - Die Priorität des ausgewählten Buttons ('urgent', 'medium' oder 'low').
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

function clearInput() {
  updateAssignContactInput();
  selectedContacts = [];
  updateContactsDropdown(contacts);
  document.getElementById("subtasksList").innerHTML = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due").value = "";
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("subtasks").value = "";
}


function toggleContactsDropdown() {
  const dropdown = document.getElementById("contactsDropdown");
  const arrowImage = document.getElementById("arrow");
  dropdown.classList.toggle("show");

  if (dropdown.classList.contains('show')) {
    arrowImage.classList.add('rotate-180');
} else {
    arrowImage.classList.remove('rotate-180');
}
}

function updateContactsDropdown(contacts) {
  const contactsDropdown = document.getElementById("contactsDropdown");
  contactsDropdown.innerHTML = "";

  contacts.forEach((contact) => {
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

    // Checkbox image
    const checkboxImg = document.createElement("img");
    checkboxImg.setAttribute(
      "src",
      selectedContacts.includes(contact.createdAt)
        ? "img/checkedCheckboxWhite.png"
        : "img/checkboxNotChecked.png"
    );
    checkboxImg.className = "contact-checkbox";

    // Appending the name container and checkbox image to the contact element
    contactElement.appendChild(nameContainer);
    contactElement.appendChild(checkboxImg);

    // Event handler for selection
    contactElement.onclick = function () {
      const index = selectedContacts.indexOf(contact.createdAt);
      if (index > -1) {
        selectedContacts.splice(index, 1);
        contactElement.classList.add("d-none"); // Hide if it's not part of the search
        checkboxImg.setAttribute("src", "img/checkboxNotChecked.png");
        contactElement.classList.remove("selected");
      } else {
        selectedContacts.push(contact.createdAt);
        checkboxImg.setAttribute("src", "img/checkedCheckboxWhite.png");
        contactElement.classList.add("selected");
        contactElement.classList.remove("d-none");
      }
      updateAssignContactInput();
    };

    if (selectedContacts.includes(contact.createdAt)) {
      contactElement.classList.add("selected");
    }

    contactsDropdown.appendChild(contactElement);
  });
}

function updateAssignContactInput() {
  const selectedContactsContainer = document.getElementById(
    "selectedContactsContainer"
  );

  // Clear previously displayed selected contacts to prepare for updated display
  selectedContactsContainer.innerHTML = "";

  // Ensure selectedContacts array is maintained correctly across user actions
  selectedContacts.forEach((contactId) => {
    const contact = contacts.find((c) => c.createdAt === contactId);
    if (contact) {
      const initialsDiv = document.createElement("div");
      initialsDiv.className = "contact-initials";
      initialsDiv.textContent = contact.initials;
      initialsDiv.style.backgroundColor = contact.color;
      selectedContactsContainer.appendChild(initialsDiv);
    }
  });
}

let selectedCategory = ''; 

function updateCategoryDropdown() {
  const categoryDropdown = document.getElementById('categoryDropdown');
  categoryDropdown.innerHTML = ''; 

 
  const categories = ['Technical Task', 'User Story'];

  categories.forEach((category) => {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('category-option');
    categoryElement.textContent = category;

    categoryElement.onclick = function () {
      selectedCategory = category; // Update the selected category
      document.querySelector('.category-input').value = category; // Display selected category in the input field
      toggleCategoryDropdown(); // Hide the dropdown after selection
    };

    categoryDropdown.appendChild(categoryElement);
  });
}

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    const arrowImage = document.getElementById('arrow2')
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
        dropdown.style.display = 'block'; 
        arrowImage.classList.add('rotate-180');
    } else {
        dropdown.style.display = 'none'; 
        arrowImage.classList.remove('rotate-180');
    }
}


function attachInputEventListeners() {
   
    
  const assignContactInput = document.querySelector(".assignContact");
  const dropdown = document.getElementById("contactsDropdown");

  assignContactInput.addEventListener("input", function () {
    const searchTerm = assignContactInput.value.toLowerCase();
    const contactOptions = document.querySelectorAll(".contact-option");

    contactOptions.forEach((option) => {
      const contactId = option.getAttribute("data-contact-id");
      const contact = contacts.find(
        (c) => c.createdAt.toString() === contactId
      );
      // Remove visibility when selected contact doesn't fit search
      if (
        contact &&
        (contact.firstName.toLowerCase().includes(searchTerm) ||
          contact.lastName.toLowerCase().includes(searchTerm))
      ) {
        option.classList.remove("d-none");
      } else {
        option.classList.add("d-none");
      }
    });
    // Ensure dropdown opens upon typing if it's not already open
    if (!dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
    }
  });

  // Event listener to open the dropdown when the input field is focused
  assignContactInput.addEventListener("focus", function () {
    // Only open the dropdown if it's not already open
    if (!dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
    }
  });

  document.querySelector(".contactInput img").addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the input
    toggleContactsDropdown();
});

document.querySelector(".categoryInput img").addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the input
    toggleCategoryDropdown();
});
  // Listener for clicks outside the dropdown or input to close the dropdown
  document.getElementById('main-add-task-container').addEventListener("click", function (event) {
    if (
      !dropdown.contains(event.target) &&
      !assignContactInput.contains(event.target)
    ) {
      dropdown.classList.remove("show");
    }
  });

  // Listener for clicks outside the dropdown or input to close the dropdown
  document.addEventListener("click", function (event) {
   
    if (
      !dropdown.contains(event.target) &&
      !assignContactInput.contains(event.target)
    ) {
        
      dropdown.classList.remove("show");
    }
  });
  // Attach this validation to an event listener for the input or form submission
  document.getElementById("due").addEventListener("change", function () {
    const isValid = isValidDate(this.value);
    if (!isValid) {
      alert("The date entered does not exist. Please enter a valid date.");

      this.value = ""; // Clear the invalid date
    }
  });
  document.getElementById("due").addEventListener("blur", function () {
    var value = this.value.replace(/[\.\-\/]/g, ""); // Remove dots, dashes, and slashes

    // Automatically insert slashes for ddmmyyyy format
    if (value.length > 2 && value.length <= 4)
      value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 4)
      value =
        value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);

    this.value = value;

    // Add validation for correct date if needed
    if (value.length === 10) {
      // Check if full length date is entered
      if (!isValidDate(this.value)) {
        alert("The date entered does not exist. Please enter a valid date.");
        this.value = ""; // Clear the input if the date is invalid
      }
    }
  });

}
function addSubtask(event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault(); // Prevent form submission

    const subtasksInput = document.getElementById("subtasks");
    const subtaskText = subtasksInput.value.trim();

    if (subtaskText) {
      const subtasksList = document.getElementById("subtasksList");
      const li = document.createElement("li");
      li.textContent = subtaskText;
      li.addEventListener("dblclick", () => openEditField(li));
      subtasksList.appendChild(li);

      subtasksInput.value = ""; // Clear input field
    }
  }
}

function openEditField(li) {
  // Create a wrapper div to hold the input field and the images
  const wrapper = document.createElement("div");
  wrapper.className = "edit-field-wrapper"; // CSS class for styling

  // Create edit input field
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = li.textContent;
  editInput.className = "edit-input"; // CSS class for styling

  // Create save button
  const saveButton = document.createElement("img");
  saveButton.src = "img/edit.png"; // Path to edit image
  saveButton.className = "edit-btn"; // CSS class for styling
  saveButton.addEventListener("click", () => saveEdit(li, editInput.value));

  // Create delete button
  const deleteButton = document.createElement("img");
  deleteButton.src = "img/delete.png"; // Path to delete image
  deleteButton.className = "delete-btn"; // CSS class for styling
  deleteButton.addEventListener("click", () => deleteSubtask(li));

  // Create confirm button
  const confirmButton = document.createElement("img");
  confirmButton.src = "img/tick.png";
  confirmButton.className = "confirm-btn";
  confirmButton.addEventListener("click", () => saveEdit(li, editInput.value));

  // Append the input and images to the wrapper
  wrapper.appendChild(editInput);
  wrapper.appendChild(saveButton);
  wrapper.appendChild(deleteButton);
  wrapper.appendChild(confirmButton);

  // Clear the list item content and append the wrapper
  li.innerHTML = "";
  li.appendChild(wrapper);
}

function saveEdit(li, newValue) {
  li.textContent = newValue; // Update the list item text
  li.addEventListener("dblclick", () => openEditField(li)); // Add double-click listener again
}

function deleteSubtask(li) {
  li.remove(); // Remove the list item
}

function isValidDate(dateString) {
  // Normalize the date string by replacing non-numeric characters with a slash
  const normalizedDateString = dateString.replace(/[\.\-]/g, "/");
  let regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  let match = normalizedDateString.match(regex);

  // Attempt to match ddmmyyyy format if the initial regex fails
  if (!match) {
    regex = /^([0-9]{2})([0-9]{2})([0-9]{4})$/;
    match = dateString.match(regex);
    if (match) {
      // Reformat to dd/mm/yyyy for consistency in further validation
      match = [match[0], match[1], match[2], match[3]];
    }
  }

  if (!match) {
    return false; // Does not match any expected pattern
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-based
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return true; // The date is valid
  } else {
    return false; // The date does not exist
  }
}
