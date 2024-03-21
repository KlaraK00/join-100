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
 * On the mobile-version this function starts the touch-drag-and-drop-process.
 * It moves the task and shows and removes empty elements for a great user experience.
 * Also you are able to scroll with the task up and down.
 * 
 * @param {Event} event - The event object representing the touch-event.
 */
function drag(event) {
    if(screenMobile()) {
        event.preventDefault();
        movingTask(event);
        showAndRemoveEmptyDiv(event);
        scrollDownOrUpWithTask(event);
    }
}

/**
 * Checks if the screen is on mobile-version.
 * 
 * @returns {boolean} - Returns true when the width is equal or less than 1100.
 */
function screenMobile() {
    return window.innerWidth <= 1100;
}

/**
 * Moves the task over the screen relating to the touch-event.
 * 
 * @param {Event} event - Passes an event object for navigating the task-coordinates.
 */
function movingTask(event) {
    event.target.style.position = "absolute";
    event.target.style.zIndex = "2";
    event.target.style.left = event.touches[0].pageX-event.target.clientWidth/2 + 'px';
    event.target.style.top = event.touches[0].pageY-event.target.clientHeight/2 + 'px';
}

/**
 * The variable currentDropElement changes to the id of the specific status-row the task-object hovers on.
 * On the same time it shows an empty task on this exactly status-row and removes the empty task, if the moving task-object hovers on no status-row.
 * 
 * @param {Event} event - The event object representing the touch-event.
 */
function showAndRemoveEmptyDiv(event) {
    let toDoRect = document.getElementById('divToDo').getBoundingClientRect();
    let inProgressRect = document.getElementById('divInProgress').getBoundingClientRect();
    let awaitFeedbackRect = document.getElementById('divAwaitFeedback').getBoundingClientRect();
    let doneRect = document.getElementById('divDone').getBoundingClientRect();
    let targetRect = event.target.getBoundingClientRect();
    if(targetRect.top+targetRect.height/2 < toDoRect.bottom && targetRect.top+targetRect.height/2 > toDoRect.top) {
        showEmptyDivInDiv('divToDo');
    } else if (targetRect.top+targetRect.height/2 < inProgressRect.bottom && targetRect.top+targetRect.height/2 > inProgressRect.top) {
        showEmptyDivInDiv('divInProgress');
    } else if (targetRect.top+targetRect.height/2 < awaitFeedbackRect.bottom && targetRect.top+targetRect.height/2 > awaitFeedbackRect.top) {
        showEmptyDivInDiv('divAwaitFeedback');
    } else if (targetRect.top+targetRect.height/2 < doneRect.bottom && targetRect.top+targetRect.height/2 > doneRect.top) {
        showEmptyDivInDiv('divDone');
    } else {
        removeEmptyDiv(currentDropElement);
    }  
}

/**
 * Shows an empty task in the specific status-row.
 */
function showEmptyDivInDiv(id) {
    currentDropElement = id;
    showEmptyDiv(currentDropElement);
}

/**
 * Shows an empty div. It lets you see the exact height and width of the current dragged element.
 * 
 * @param {string} id - Uses the id of a specific element as parameter.
 */
function showEmptyDiv(id) {
    if(draggingOnce) {
        let element = document.getElementById(id);
        let emptyDiv = document.createElement('div');
        emptyDiv.id = id + 'EmptyDiv';
        emptyDiv.className = 'emptyDivForDraggedElement zIndexMinus1';
        emptyDiv.style.width = (document.getElementById(currentDraggedElement).clientWidth - 5) + 'px';    
        emptyDiv.style.height = (document.getElementById(currentDraggedElement).clientHeight - 5) + 'px';
        element.appendChild(emptyDiv);
        draggingOnce = false;
    }
}

/**
 * Removes an empty div.
 * 
 * @param {string} id - Uses the id of a specific element as parameter.
 */
function removeEmptyDiv(id) {
    if(!draggingOnce) {
        let element = document.getElementById(`${id}EmptyDiv`);
        if(element) {
            element.remove();
            draggingOnce = true;
        }
    }
}

/**
 * Scrolls up or down while touching and moving the task-object.
 * 
 * @param {Event} event - The event object representing the touch-event.
 */
function scrollDownOrUpWithTask(event) {
    scrollUpWithTask(event);
    scrollDownWithTask(event);
}

/**
 * While the dragging task touches the top of the document, you are scrolling up until reaching the absolute top.
 * 
 * @param {Event} event - The event object representing the touch-event.
 */
function scrollUpWithTask(event) {
    if(event.touches[0].clientY-event.target.clientHeight/2 <= 0) {
        scroll(0, window.scrollY-15);
    }
}

/**
 * While the dragging task touches the bottom of the document, you are scrolling down until reaching the absolute bottom.
 * 
 * @param {Event} event - The event object representing the touch-event.
 */
function scrollDownWithTask(event) {
    if(event.touches[0].clientY+event.target.clientHeight/2 > screen.height && window.scrollY <= (document.body.scrollHeight - screen.height)) {
        console.log(event.touches[0].pageY+event.target.clientHeight/2)
        scroll(0, window.scrollY+15);
    }
}

/**
 * The drop of the task removes all empty task-elements and sets the right status for the dropping task.
 */
function drop() {
    if(screenMobile()) {
        if(currentDropElement) {
            removeEmptyDiv(currentDropElement);
            let newStatusFirstLetter = currentDropElement.slice(3).charAt(0).toLowerCase(0);
            let newStatus = newStatusFirstLetter + currentDropElement.slice(4);
            moveTo(newStatus);
        }
    }
}