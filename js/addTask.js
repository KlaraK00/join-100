let tasks = [];
let selectedContacts = [];
const TaskStatus = {
  TODO: "toDo",
  IN_PROGRESS: "inProgress",
  AWAIT_FEEDBACK: "awaitFeedback",
  DONE: "done",
};

async function initApp() {
    await includeHTML(); // ensures the Template is loaded 
    initAddTask(); // Now safe to initialize tasks and attach event listeners
  }
  
  async function initAddTask() {
    loadLoggedIn();
    if(loggedIn) {
      await loadTasks();
      await loadContacts();
      await loadUsers();
      updateContactsDropdown(contacts); 
      highlightActiveSideButton();
      currentUser = getCurrentUser();
      showUserNavBar();
      attachInputEventListeners(); // Attach event listeners so they are called after content is loaded
      
    }
  }
  
  // Modification to the way you bootstrap your application
  document.addEventListener('DOMContentLoaded', initApp); // Use initApp to coordinate initialization
  

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
  let dueDate = getInputValue("due");
  // Check required fields 
  if (!title.trim() || !dueDate.trim()) {
    alert("Please fill in all required fields.");
    return; // Exit the function 
  }
  let description = getInputValue("description");
  
  let contacts = selectedContacts;
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
  selectedContacts = [];
  clearInput();
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
  return "";
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
    updateAssignContactInput();
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("due").value = "";
    document.getElementById("category").selectedIndex = 0; 
    document.getElementById("subtasks").value = "";
    document.querySelectorAll("#priority .prio button").forEach(button => {
      button.classList.remove("active");
})
}

 function toggleContactsDropdown() {
    const dropdown = document.getElementById('contactsDropdown');
    dropdown.classList.toggle('show'); 
    
} 


function updateContactsDropdown(contacts) {
    const contactsDropdown = document.getElementById("contactsDropdown");
    contactsDropdown.innerHTML='';

    contacts.forEach((contact) => {
        const contactElement = document.createElement("div");
        contactElement.classList.add("contact-option");
        contactElement.setAttribute('data-contact-id', contact.createdAt);
    
       
        const nameContainer = document.createElement("div");
        nameContainer.classList.add("name-container")
        
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
        checkboxImg.setAttribute("src", selectedContacts.includes(contact.createdAt) ? "img/checkedCheckboxWhite.png" : "img/checkboxNotChecked.png");
        checkboxImg.className = "contact-checkbox"; 
    
        // Appending the name container and checkbox image to the contact element
        contactElement.appendChild(nameContainer);
        contactElement.appendChild(checkboxImg);
        
        
        // Event handler for selection
        contactElement.onclick = function() {
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
    });}
    
    

    function updateAssignContactInput() {
        const selectedContactsContainer = document.getElementById("selectedContactsContainer");
        
        // Clear previously displayed selected contacts to prepare for updated display
        selectedContactsContainer.innerHTML = '';
        
        // Ensure selectedContacts array is maintained correctly across user actions
        selectedContacts.forEach(contactId => {
            const contact = contacts.find(c => c.createdAt === contactId);
            if (contact) {
                const initialsDiv = document.createElement("div");
                initialsDiv.className = "contact-initials"; 
                initialsDiv.textContent = contact.initials;
                initialsDiv.style.backgroundColor = contact.color;
                selectedContactsContainer.appendChild(initialsDiv);
            }
        });
       
    } 
    
    function attachInputEventListeners() {
        const assignContactInput = document.querySelector(".assignContact");
        const dropdown = document.getElementById('contactsDropdown');
    
        assignContactInput.addEventListener('input', function() {
            const searchTerm = assignContactInput.value.toLowerCase();
            const contactOptions = document.querySelectorAll(".contact-option");
    
            contactOptions.forEach(option => {
                const contactId = option.getAttribute('data-contact-id');
                const contact = contacts.find(c => c.createdAt.toString() === contactId);
                // Remove visibility when selected contact doesn't fit search
                if (contact && (contact.firstName.toLowerCase().includes(searchTerm) || contact.lastName.toLowerCase().includes(searchTerm))) {
                    option.classList.remove("d-none");
                } else {
                    option.classList.add("d-none");
                }
            });
            // Ensure dropdown opens upon typing if it's not already open
            if (!dropdown.classList.contains('show')) {
                dropdown.classList.add('show');
            }
        });
    
        // Event listener to open the dropdown when the input field is focused
        assignContactInput.addEventListener('focus', function() {
            // Only open the dropdown if it's not already open
            if (!dropdown.classList.contains('show')) {
                dropdown.classList.add('show');
            }
        });
    
        // Listener for clicks outside the dropdown or input to close the dropdown
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target) && !assignContactInput.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
    
    
    
    




