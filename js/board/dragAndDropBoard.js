/**
 * Initializes the dragging-process by setting the "draggingOnce"-variable to true and transforming the look of the current dragged element.
 * 
 * @param {string} id - Passes the id from the current dragged element.
 */
function startDragging(id) {
    draggingOnce = true;
    currentDraggedElement = id;
    let element = document.getElementById(id);
    element.style.transform = 'rotate(5deg)';
}

/**
 * Allows to drop a task down on another element by preventing the default mode of the specific element.
 * 
 * @param {Event} event - The event object representing the drop event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Shows an empty div.
 * 
 * @param {string} id - Uses the id of a specific element as parameter.
 */
function showEmptyDiv(id) {
    if(draggingOnce) {
        let element = document.getElementById(id);
        element.innerHTML += `<div id="${id}EmptyDiv" class="emptyDivForDraggedElement zIndexMinus1"></div>`;
        draggingOnce = false;
    }
}

/**
 * Changes the value of the key "status" from a specific task and stores the edited data in the remote storage.
 * 
 * @param {string} newStatus 
 */
async function moveTo(newStatus) { 
    let id = currentDraggedElement.slice(currentDraggedElement.length -13);
    let element = tasks.find(task => task.createdAt == id);
    element.status = newStatus;
    await setItem('tasks', tasks);
    renderAllTasks();
}

/**
 * Hides an empty div.
 * 
 * @param {string} id - Uses the id of a specific element as parameter.
 */
function removeEmptyDiv(id) {
    if(!draggingOnce) {
        let element = document.getElementById(`${id}EmptyDiv`);
        element.remove();
        draggingOnce = true;
    }
}

// function allowMovingElementByTouching(event) {
//     event.preventDefault();
//     debugger;
//     let touch = event.touch.target;
//     event.target.style.left = touch.pageX + 'px';
//     event.target.style.top = touch.pageY + 'px';
// }