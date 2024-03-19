/**
 * Opens a specific task by showing an overlay with more information about the task.
 * 
 * @param {string} taskCreatedAt - Uses a unique long number to identify the specific task.
 */
function openTask(taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    boardTaskOverlay.innerHTML = HTMLTemplatePopUpTask(task);
    categoryBackground(task, `boardPopUpCategory${task.createdAt}`);
    renderDatePopUpBoard(task);
    renderContactsPopUpBoard(task);
    renderSubtasksPopUpBoard(task);
    renderPriorityPopUpBoard(task);
}

/**
 * Closes the task by hiding the overlay of the task.
 */
function closeTask() {
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    let boardTaskOverlayChildElement = document.getElementById('boardTaskOverlay').firstElementChild;
    if(addTaskOverlay) {
        closeAddTaskOverlay();
    }
    if(boardTaskOverlayChildElement) {
        closeBoardTaskOverlay();
    }
}

function closeAddTaskOverlay() {
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    addTaskOverlay.classList.add('animationRightSlideOut');
    setTimeout(() => {
        let boardTaskOverlayAddTask = document.getElementById('boardTaskOverlayAddTask');
        boardTaskOverlayAddTask.classList.add('d-none');
        addTaskOverlay.classList.remove('animationRightSlideOut');
    }, 500);
}

function closeBoardTaskOverlay() {
    let boardTaskOverlayChildElement = document.getElementById('boardTaskOverlay').firstElementChild;
    boardTaskOverlayChildElement.firstElementChild.classList.add('animationRightSlideOut');
    setTimeout(() => {
        let boardTaskOverlay = document.getElementById('boardTaskOverlay');
        boardTaskOverlay.innerHTML = '';
        editTaskContacts = undefined;
        editTaskSubtasks = undefined;
    }, 500);
}

/**
 * Renders the right format of the date of a specific task.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderDatePopUpBoard(task) {
    let boardPopUpDate = document.getElementById('boardPopUpDate');
    if (task.date.includes('-')) {
        boardPopUpDate.innerHTML = getFormattedDate(task.date);
    }
}

/**
 * Gets the formatted date.
 * 
 * @param {string} date - Uses the date with the format "yyyy-mm-dd" as a paramenter.
 * @returns {string} - Returns the formatted date.
 */
function getFormattedDate(date) {
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10);
    let formattedDate = day + '/' + month + '/' + year;
    return formattedDate;
}

/**
 * Renders all contacts from a specific task for the overlay-task-view if there are contacts.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderContactsPopUpBoard(task) {
    if(task.contacts == "") {
        removeContactsPopUpBoard(task);
    } else {
        let div = document.getElementById(`popUpContacts${task.createdAt}`);
        div.innerHTML = '';
        for (let i = 0; i < task.contacts.length; i++) {
            if(contacts.find(c => c.createdAt == task.contacts[i])) {
                let contact = contacts.find(c => c.createdAt == task.contacts[i]);
                div.innerHTML += HTMLTemplatePopUpContact(contact);
            }
        }
    }
}

/**
 * Removes the space from the contacts in the task-overlay.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function removeContactsPopUpBoard(task) {
    let divOfContacts = document.getElementById(`popUpContacts${task.createdAt}`).parentElement;
    divOfContacts.remove();
}

/**
 * Renders all subtasks from a specific task for the task-overlay-view if subtasks exists.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderSubtasksPopUpBoard(task) {
    if(task.subtasks == "") {
        let popUpSubtasksParent = document.getElementById(`popUpSubtasks${task.createdAt}`).parentElement;
        popUpSubtasksParent.remove();
    } else {
        let popUpSubtasks = document.getElementById(`popUpSubtasks${task.createdAt}`);
        popUpSubtasks.innerHTML = '';
        for (let i = 0; i < task.subtasks.length; i++) {
            let subtask = task.subtasks[i];
            popUpSubtasks.innerHTML += HTMLTemplatePopUpSubtask(task, subtask, i);
            renderSubtasksPopUpBoardCheckbox(task, i);
        }
    }
}

/**
 * Renders the a checked checkbox if the specific subtask is done and not a checked checkbos if the subtask is not done.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 * @param {number} i - Passes the index of the subtask.
 */
function renderSubtasksPopUpBoardCheckbox(task, i) {
    let subtaskCheckboxImg = document.getElementById(`boardPopUpSubtask${task.createdAt}${i}`);
    if(task.subtasks[i].done) {
        subtaskCheckboxImg.src = "./img/registerCheckedCheckbox.png";
    }
}

/**
 * Renders the priority of a specific task for the task-overlay-view if there is a priority.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderPriorityPopUpBoard(task) {
    if(task.prio == '') {
        removePopUpPrioDiv(task);
    } else {
        let popUpBoardPriorityDiv = document.getElementById(`boardPopUpPriority${task.createdAt}`);
        popUpBoardPriorityDiv.innerHTML = HTMLTemplatePopUpPriority(task);
    }
}

/**
 * Removes the whole space from the priority for the task-overlay-view.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function removePopUpPrioDiv(task) {
    let popUpBoardPriorityDiv = document.getElementById(`boardPopUpPriority${task.createdAt}`);
    popUpBoardPriorityDiv.remove();
}

/**
 * Changes the button "edit" from the task-overlay to blue.
 */
function changeBoardTaskPopUpEditToBlue() {
    let img = document.getElementById('boardTaskPopUpEditImg');
    let span = document.getElementById('boardTaskPopUpEditSpan');
    img.src = "./img/edit-blue.png";
    span.style.color = "#29ABE2";
    span.style.fontWeight = "bold";
}

/**
 * Changes the button "edit" from the task-overlay to black.
 */
function changeBoardTaskPopUpEditToBlack() {
    let img = document.getElementById('boardTaskPopUpEditImg');
    let span = document.getElementById('boardTaskPopUpEditSpan');
    img.src = "./img/edit-black.png";
    span.style.color = "#000000";
    span.style.fontWeight = "400";
}

/**
 * Changes the button "delete" from the task-overlay to blue.
 */
function changeBoardTaskPopUpDeleteToBlue() {
    let img = document.getElementById('boardTaskPopUpDeleteImg');
    let span = document.getElementById('boardTaskPopUpDeleteSpan');
    img.src = "./img/delete-blue.png";
    span.style.color = "#29ABE2";
    span.style.fontWeight = "bold";
}

/**
 * Changes the button "delete" from the task-overlay to black.
 */
function changeBoardTaskPopUpDeleteToBlack() {
    let img = document.getElementById('boardTaskPopUpDeleteImg');
    let span = document.getElementById('boardTaskPopUpDeleteSpan');
    img.src = "./img/delete.png";
    span.style.color = "#000000";
    span.style.fontWeight = "400";
}

/**
 * Shows an overlay of the openTask-Template.
 */
async function openAddTask(status) {
    await loadDataForAddTaskOverlay(status);
    addCloseImageOnAddTaskOverlay();
    openAddTaskOverlay();
}

/**
 * Loads all the data needed to open the overlay without errors.
 * 
 * @param {string} status - Uses the current status of a task as parameter.
 */
async function loadDataForAddTaskOverlay(status) {
    await initApp();
    currentStatus = status;
    setLocalStorageItem('currentStatus', currentStatus);
}

/**
 * Adds a close-image on the add-task-overlay so you can close it.
 */
function addCloseImageOnAddTaskOverlay() {
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    addTaskOverlay.innerHTML += `<img onclick="closeTask(), clearInput()" class="posAbsolute top45 right47 cursorPointer addTaskOverlayCloseImg" src="./img/Close.png" alt="close">`;
}

/**
 * Opens the task after 100 milliseconds.
 */
function openAddTaskOverlay() {
    setTimeout(() => {
        let boardTaskOverlayAddTask = document.getElementById('boardTaskOverlayAddTask');
        boardTaskOverlayAddTask.classList.remove('d-none');
    }, 100);
}