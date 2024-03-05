
let tasks = [];
function createTask() {
    // Retrieve values from HTML elements
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let assignedTo = document.getElementById('assign').value; // Added ID for Assigned To field
    let dueDate = document.getElementById('due').value;
    let priority = getPriority();
    let category = document.getElementById('category').value;
    let subtasks = document.getElementById('subtasks').value;

    // Create a task object
    let task = {
        title: title,
        description: description,
        assignedTo: assignedTo,
        dueDate: dueDate,
        priority: priority,
        category: category,
        subtasks: subtasks
    };

    

    // Perform further actions with the task object, such as adding it to an array, sending it to a server, etc.
    console.log(task); // For demonstration, log the task object to the console

    // Push the task object into the tasks array
    tasks.push(task);

    // Optionally, convert the array to JSON format
    let tasksJSON = JSON.stringify(tasks);
    console.log(tasksJSON);
    
}
