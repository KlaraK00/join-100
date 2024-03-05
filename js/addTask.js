let tasks = [];

function createTask() {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let assignedTo = document.getElementById("assign").value; 
  let dueDate = document.getElementById("due").value;
  let priority = getPriority();
  let category = document.getElementById("category").value;
  let subtasks = document.getElementById("subtasks").value;

  let task = {
    title: title,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDate,
    priority: priority,
    category: category,
    subtasks: subtasks,
  };

  console.log(task);

  tasks.push(task);

  let tasksJSON = JSON.stringify(tasks);
  console.log(tasksJSON);
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

