let tasks = [];

// Function to retrieve input value
function getInputValue(id) {
    return document.getElementById(id).value;
}

// Function to create a task object
function createTaskObject(title, description, assignedTo, dueDate, priority, category, subtasks) {
    return {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        category,
        subtasks,
    };
}


function pushTask(task) {
    console.log(task);
    tasks.push(task); 
    console.log(JSON.stringify(tasks));
}

// The main function to create a task
function createTask() {
    let title = getInputValue("title");
    let description = getInputValue("description");
    let assignedTo = getInputValue("assign");
    let dueDate = getInputValue("due");
    let priority = getPriority(); 
    let category = getInputValue("category");
    let subtasks = getInputValue("subtasks");

    let task = createTaskObject(title, description, assignedTo, dueDate, priority, category, subtasks);

    pushTask(task);
}

function getPriority() {
    //access all prio buttons
    let priorityButtons = document.querySelectorAll('.prio button'); 
    //loop through buttons
    for (let button of priorityButtons) {
        //check for active class
        if (button.classList.contains('active')) { 
            return button.textContent.trim(); 
        }
    }
    return "Not set"; 
}

function activateButton(buttonId) {
    //remove active from all buttons
    document.querySelectorAll('#priority .prio button').forEach(button => {
        button.classList.remove('active');
    });

    //add active to the button the user clicks on 
    let button = document.getElementById(buttonId);
    button.classList.add('active');
}

