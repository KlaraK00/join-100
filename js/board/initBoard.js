let currentDraggedElement;
let currentDropElement;
let boardCurrentPrio = '';
let editTaskContacts;
let editTaskSubtasks;
let draggingOnce = true;

/**
 * Checks if the user is logged in.
 * If yes it loads the board, if not it informs the user about a log-in-error.
 */
function initBoard() {
    loadLoggedIn();
    if(loggedIn) {
        loadingBoard();
    } else {
        showLogInError();
    }
}

/**
 * Starts loading the board-site asynchronously.
 * It loads data from the remote storage, sets the current user and renders all loaded tasks.
 */
async function loadingBoard() {
    await includeHTML();
    await initApp();
    await loadContacts();
    await loadTasks();
    currentStatus = getCurrentStatus();
    highlightActiveSideButton();
    currentUser = getCurrentUser();
    showUserNavBar();
    renderAllTasks();
}

/**
 * Gets the currentStatus-variable to set the status of an added task right.
 * 
 * @returns {string} - Returns the value of the key "currentStatus".
 */
function getCurrentStatus() {
    if(currentStatusExists()) {
        return getLocalStorageItem('currentStatus');
    }
}
  
/**
 * Checks if there exists a local-storage-key named "currentStatus".
 * 
 * @returns {null || string} - Returns null if there is no key "currentStatus" in the local storage and returns the value a string if the key is found.
 */
function currentStatusExists() {
    return getLocalStorageItem('currentStatus');
}

/**
 * Initializes to render all tasks from the remote storage.
 */
function renderAllTasks() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}

/**
 * Renders all "to-do-tasks".
 */
function renderToDo() {
    let allTasksToDo = tasks.filter(task => task.status == 'toDo');
    if(allTasksToDo.length > 0) {
        let divToDo = document.getElementById('divToDo');
        divToDo.innerHTML = '';
        for (let i = 0; i < allTasksToDo.length; i++) {
            let task = allTasksToDo[i];
            divToDo.innerHTML += HTMLTemplateTask(task);
            categoryBackground(task, `boardCategory${task.createdAt}`);
            renderSubtasks(task);
            renderContactsAndPriorityBoard(task);
        }
    } else {
        let divToDo = document.getElementById('divToDo');
        divToDo.innerHTML = '';
        divToDo.innerHTML = /*html*/`<div class="noTasksDiv">No tasks To do</div>`;
    }
}

/**
 * Sets the right background-color for the specific category.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 * @param {string} id - Passes the id to speak to the right element which gets the right the background-color.
 */
function categoryBackground(task, id) {
    let div = document.getElementById(id);
    if (task.category == 'Technical Task') {
        div.classList.add('technicalTaskBg');
    } else {
        div.classList.add('userStoryBg');
    }
}

/**
 * Render all subtasks from a specific task from the remote storage.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderSubtasks(task) {
    if (task.subtasks.length > 0) {
        let subtasksDone = getSubtasksDone(task);
        createNumbersForSubtasks(task, subtasksDone);
        createProgressBarForSubtasks(task, subtasksDone);
        createMoreDetailsProgressInformation(task, subtasksDone);
    } else {
        let subtaskDiv = document.getElementById(`subtasksBoardOverDiv${task.createdAt}`);
        subtaskDiv.remove();
    }
}
function createMoreDetailsProgressInformation(task, subtasksDone) {
    let moreDetailsProgressInformationDiv = document.getElementById(`moreDetailsProgressInformation${task.createdAt}`);
    moreDetailsProgressInformationDiv.innerHTML = '';
    moreDetailsProgressInformationDiv.innerHTML = `${subtasksDone} von ${task.subtasks.length} Subtasks erledigt`;
}

/**
 * Gets the length of subtasks that are done from a specific task from the remote storage.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 * @returns {number} - Returns the length of all subtasks that are done.
 */
function getSubtasksDone(task) {
    let subtasksDone = task.subtasks.filter(subtask => subtask.done);
    return subtasksDone.length;
}

/**
 * Shows how many subtasks are done and how many subtasks are total.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 * @param {number} subtasksDone - Passes the number of subtasks that are done.
 */
function createNumbersForSubtasks(task, subtasksDone) {
    let howManySubtasksDoneDiv = document.getElementById(`subtasksBoard${task.createdAt}`);
    howManySubtasksDoneDiv.innerHTML = '';
    howManySubtasksDoneDiv.innerHTML = `${subtasksDone}/${task.subtasks.length} Subtasks`;
}

/**
 * Shows with a progressbar how many subtasks are total and how many subtasks are done.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 * @param {number} subtasksDone - Passes the number of subtasks that are done.
 */
function createProgressBarForSubtasks(task, subtasksDone) {
    let percentage = subtasksDone / task.subtasks.length * 100 + '%';
    let blueProgressBarDiv = document.getElementById(`blueProgressBar${task.createdAt}`); 
    let greyProgressBarDiv = document.getElementById(`greyProgressBar${task.createdAt}`); 
    blueProgressBarDiv.style.width = percentage;
    greyProgressBarDiv.style.width = "100%";
}

/**
 * Begins to render the contacts and priority for the overall board-view.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderContactsAndPriorityBoard(task) {
    if((!task.contacts || task.contacts == "") && (!task.prio || task.prio == "")) {
        removeContactsAndPriorityDiv(task);
    } else {
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
    }
}

/**
 * Removes the whole content of the contacts and priority.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function removeContactsAndPriorityDiv(task) {
    let divOfContactsAnPriority = document.getElementById(`contacts${task.createdAt}`).parentElement;
    divOfContactsAnPriority.remove();
}

/**
 * Starts to render the contacts for the overall board-view.
 *  
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderContactsBoard(task) {
    let div = document.getElementById(`contacts${task.createdAt}`);
    div.innerHTML = '';
    for (let i = 0; i < task.contacts.length; i++) {
        if(contacts.find(c => c.createdAt == task.contacts[i])){
            let contact = contacts.find(c => c.createdAt == task.contacts[i]);
            div.innerHTML += /*html*/`<div class="initialsBoard" style="background-color:${contact.color}">${contact.initials}</div>`;
        }
    }
}

/**
 * Starts to render the priority for the overall board-view.
 *  
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderPriorityAtBoard(task) {
    let div = document.getElementById(`priority${task.createdAt}`);
    div.innerHTML = '';
    if (priorityExistsAtBoard(task)) {
        let priority = task.prio;
        div.innerHTML = /*html*/`<img src="./img/${priority}Prio.png">`;
    }
}

/**
 * Checks if a priority-value exists
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 * @returns {boolean} - Returns "true" if a priority-value for the task exists and "false" if it doesn't.
 */
function priorityExistsAtBoard(task) {
    return task.prio !== '';
}

/**
 * Renders all "in-progress-tasks".
 */
function renderInProgress() {
    let allTasksInProgress = tasks.filter(task => task.status == 'inProgress');
    if(allTasksInProgress.length > 0) {
        let divInProgress = document.getElementById('divInProgress');
        divInProgress.innerHTML = '';
        for (let i = 0; i < allTasksInProgress.length; i++) {
            let task = allTasksInProgress[i];
            divInProgress.innerHTML += HTMLTemplateTask(task);
            categoryBackground(task, `boardCategory${task.createdAt}`);
            renderSubtasks(task);
            renderContactsAndPriorityBoard(task);
        }
    } else {
        let divInProgress = document.getElementById('divInProgress');
        divInProgress.innerHTML = '';
        divInProgress.innerHTML = /*html*/`<div class="noTasksDiv">No tasks In Progress</div>`;
    }
}

/**
 * Renders all "await-feedback-tasks".
 */
function renderAwaitFeedback() {
    let allTasksAwaitFeedback = tasks.filter(task => task.status == 'awaitFeedback');
    if(allTasksAwaitFeedback.length > 0) {
        let divAwaitFeedback = document.getElementById('divAwaitFeedback');
        divAwaitFeedback.innerHTML = '';
        for (let i = 0; i < allTasksAwaitFeedback.length; i++) {
            let task = allTasksAwaitFeedback[i];
            divAwaitFeedback.innerHTML += HTMLTemplateTask(task);
            categoryBackground(task, `boardCategory${task.createdAt}`);
            renderSubtasks(task);
            renderContactsAndPriorityBoard(task);
        }
    } else {
        let divAwaitFeedback = document.getElementById('divAwaitFeedback');
        divAwaitFeedback.innerHTML = '';
        divAwaitFeedback.innerHTML = /*html*/`<div class="noTasksDiv">No tasks Await Feedback</div>`;
    }
}

/**
 * Renders all "done-tasks".
 */
function renderDone() {
    let allTasksDone = tasks.filter(task => task.status == 'done');
    if(allTasksDone.length > 0) {
        let divDone = document.getElementById('divDone');
        divDone.innerHTML = '';
        for (let i = 0; i < allTasksDone.length; i++) {
            let task = allTasksDone[i];
            divDone.innerHTML += HTMLTemplateTask(task);
            categoryBackground(task, `boardCategory${task.createdAt}`);
            renderSubtasks(task);
            renderContactsAndPriorityBoard(task);
        }
    } else {
        let divDone = document.getElementById('divDone');
        divDone.innerHTML = '';
        divDone.innerHTML = /*html*/`<div class="noTasksDiv">No tasks Done</div>`;
    }
}

/**
 * When you hover on the progressbar, it shows you a detailed information about how much is done.
 * This information in specific shows this information when the mouse enters the specific space (progressbar).
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function showDetailedProgressInformation(taskCreatedAt) {
    let moreDetailsProgressInformation = document.getElementById(`moreDetailsProgressInformation${taskCreatedAt}`);
    moreDetailsProgressInformation.classList.remove('d-none');
}

/**
 * When you hover on the progressbar, it shows you a detailed information about how much is done.
 * This function in specific hides this information when the mouse leaves the specific space.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task (progressbar).
 */
function hideDetailedProgressInformation(taskCreatedAt) {
    let moreDetailsProgressInformation = document.getElementById(`moreDetailsProgressInformation${taskCreatedAt}`);
    moreDetailsProgressInformation.classList.add('d-none');
}