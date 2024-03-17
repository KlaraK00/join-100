let currentDraggedElement;
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
    await loadContacts();
    await loadTasks();
    highlightActiveSideButton();
    currentUser = getCurrentUser();
    showUserNavBar();
    renderAllTasks();
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
    } else {
        let subtaskDiv = document.getElementById(`subtasksBoardOverDiv${task.createdAt}`);
        subtaskDiv.remove();
    }
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

/* ---------- drag and drop ---------- */

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
 * @param {*} id - Uses the id of a specific element as parameter.
 */
function removeEmptyDiv(id) {
    if(!draggingOnce) {
        let element = document.getElementById(`${id}EmptyDiv`);
        element.remove();
        draggingOnce = true;
    }
}

/* ---------- SEARCH ---------- */

/**
 * Renders all tasks if the search-input is empty and renders all searched tasks if it isn't so.
 */
function searchAllTasks() {
    let search = document.getElementById('boardSearchInput').value;
    if(boardInputIsEmpty(search)) {
        renderAllTasks();
    } else {
        renderAllSearchedTasks(search);
    }
}

/**
 * Checks if the search-input of the board is empty.
 * 
 * @param {string} search - Passes the searched value.
 * @returns {boolean} - Returns true if the input of the board is empty. If not it returns false.
 */
function boardInputIsEmpty(search) {
    return search == '';
}

/**
 * Renders all searched tasks.
 * 
 * @param {string} search - Passes the searched value.
 */
function renderAllSearchedTasks(search) {
    renderSearchedToDo(search);
    renderSearchedInProgress(search);
    renderSearchedAwaitFeedback(search);
    rendeSearchedDone(search);
}

/**
 * Renders all searched tasks that has the status "toDo".
 * 
 * @param {string} search - Passes the searched value.
 */
function renderSearchedToDo(search) {
    let allTasksToDo = tasks.filter(task => task.status == 'toDo');
    let allSearchedTasksToDo = allTasksToDo.filter(task => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search));
    let divToDo = document.getElementById('divToDo');
    divToDo.innerHTML = '';
    for (let i = 0; i < allSearchedTasksToDo.length; i++) {
        let task = allSearchedTasksToDo[i];
        divToDo.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
    }
}

/**
 * Renders all searched tasks that has the status "inProgress".
 * 
 * @param {string} search - Passes the searched value.
 */
function renderSearchedInProgress(search) {
    let allTasksInProgress = tasks.filter(task => task.status == 'inProgress');
    let allSearchedTasksInProgress = allTasksInProgress.filter(task => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search));
    let divInProgress = document.getElementById('divInProgress');
    divInProgress.innerHTML = '';
    for (let i = 0; i < allSearchedTasksInProgress.length; i++) {
        let task = allSearchedTasksInProgress[i];
        divInProgress.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
    }
}

/**
 * Renders all searched tasks that has the status "awaitingFeedback".
 * 
 * @param {string} search - Passes the searched value.
 */
function renderSearchedAwaitFeedback(search) {
    let allTasksAwaitFeedback = tasks.filter(task => task.status == 'awaitFeedback');
    let allSearchedTasksAwaitFeedback = allTasksAwaitFeedback.filter(task => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search));
    let divAwaitFeedback = document.getElementById('divAwaitFeedback');
    divAwaitFeedback.innerHTML = '';
    for (let i = 0; i < allSearchedTasksAwaitFeedback.length; i++) {
        let task = allSearchedTasksAwaitFeedback[i];
        divAwaitFeedback.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
    }
}

/**
 * Renders all searched tasks that has the status "done".
 * 
 * @param {string} search - Passes the searched value.
 */
function rendeSearchedDone(search) {
    let allTasksDone = tasks.filter(task => task.status == 'done');
    let allSearchedTasksDone = allTasksDone.filter(task => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search));
    let divDone = document.getElementById('divDone');
    divDone.innerHTML = '';
    for (let i = 0; i < allSearchedTasksDone.length; i++) {
        let task = allSearchedTasksDone[i];
        divDone.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
    }
}

/* ---------- OPEN TASK ---------- */

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

/* ---------- EDIT TASK ---------- */

function boardPopUpEdit(id) {
    let task = tasks.find(t => t.createdAt == id);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    boardTaskOverlay.innerHTML = HTMLTemplatePopUpBoardEdit(task);
    // editTaskContacts = task.contacts; // geht nicht, sonst beide gleichzeitig verändert
    editTaskContacts = task.contacts.slice(); // erstellt eine tiefe Kopie (jedoch nicht für Unterobjekte)
    editTaskSubtasks = JSON.parse(JSON.stringify(task.subtasks)); // dies erstellt eine tiefe Kopie des Arrays 'subtasks', sodass 'editTaskSubtasks' und 'task.subtasks' auf separate Arrays mit separaten Unterobjekten verweisen, und Änderungen an einem haben keinen Einfluss auf das andere.
    // editTaskSubtasks = task.subtasks.slice(); // wenn ich Unterobjekte verändern will bei einem Array, wird das andere Array gleichzeitig verändert
    renderBoardPopUpEditDate(task);
    renderBoardPopUpEditPrio(task);
    renderBoardPopUpEditContacts(task);
    renderBoardPopUpEditSubtasks(task);
}

function renderBoardPopUpEditDate(task) {
    let boardPopUpInputDate = document.getElementById('boardPopUpInputDate');
    if (task.date.includes('-')) {
        boardPopUpInputDate.value = getFormattedDate(task.date);
    }
}

function renderBoardPopUpEditPrio(task) {
    boardCurrentPrio = task.prio;
    changePrioBtn(boardCurrentPrio);
}

function changePrioBtn(priority, taskCreatedAt) {
    if(priority == 'urgent') {
        changePrioBtnUrgent(taskCreatedAt);
    } else if (priority == 'medium') {
        changePrioBtnMedium(taskCreatedAt);
    } else if (priority == 'low') {
        changePrioBtnLow(taskCreatedAt);
    } else {
        cleanAllPrioBtns(taskCreatedAt);
    }
}

function changePrioBtnUrgent(taskCreatedAt) {
    boardCurrentPrio = 'urgent';
    let btnUrgent = document.getElementById('boardPopUpEditUrgentBtn');
    btnUrgent.style.background = '#FF3D00';
    btnUrgent.style.color = 'white';
    btnUrgent.firstElementChild.src = './img/urgentPrioWhite.png';
    let btnMedium = document.getElementById('boardPopUpEditMediumBtn');
    btnMedium.style.background = 'white';
    btnMedium.style.color = 'black';
    btnMedium.firstElementChild.src = './img/mediumPrio.png';
    let btnLow = document.getElementById('boardPopUpEditLowBtn');
    btnLow.style.background = 'white';
    btnLow.style.color = 'black';
    btnLow.firstElementChild.src = './img/lowPrio.png';
}

function changePrioBtnMedium(taskCreatedAt) {
    boardCurrentPrio = 'medium';
    let btnMedium = document.getElementById('boardPopUpEditMediumBtn');
    btnMedium.style.background = '#FFA800';
    btnMedium.style.color = 'white';
    btnMedium.firstElementChild.src = './img/mediumPrioWhite.png';
    let btnUrgent = document.getElementById('boardPopUpEditUrgentBtn');
    btnUrgent.style.background = 'white';
    btnUrgent.style.color = 'black';
    btnUrgent.firstElementChild.src = './img/urgentPrio.png';
    let btnLow = document.getElementById('boardPopUpEditLowBtn');
    btnLow.style.background = 'white';
    btnLow.style.color = 'black';
    btnLow.firstElementChild.src = './img/lowPrio.png';
}

function changePrioBtnLow(taskCreatedAt) {
    boardCurrentPrio = 'low';
    let btnLow = document.getElementById('boardPopUpEditLowBtn');
    btnLow.style.background = '#7AE229';
    btnLow.style.color = 'white';
    btnLow.firstElementChild.src = './img/lowPrioWhite.png';
    let btnUrgent = document.getElementById('boardPopUpEditUrgentBtn');
    btnUrgent.style.background = 'white';
    btnUrgent.style.color = 'black';
    btnUrgent.firstElementChild.src = './img/urgentPrio.png';
    let btnMedium = document.getElementById('boardPopUpEditMediumBtn');
    btnMedium.style.background = 'white';
    btnMedium.style.color = 'black';
    btnMedium.firstElementChild.src = './img/mediumPrio.png';
}

function cleanAllPrioBtns(taskCreatedAt) {
    boardCurrentPrio = '';
    let btnUrgent = document.getElementById('boardPopUpEditUrgentBtn');
    btnUrgent.style.background = 'white';
    btnUrgent.style.color = 'black';
    btnUrgent.firstElementChild.src = './img/urgentPrio.png';
    let btnMedium = document.getElementById('boardPopUpEditMediumBtn');
    btnMedium.style.background = 'white';
    btnMedium.style.color = 'black';
    btnMedium.firstElementChild.src = './img/mediumPrio.png';
    let btnLow = document.getElementById('boardPopUpEditLowBtn');
    btnLow.style.background = 'white';
    btnLow.style.color = 'black';
    btnLow.firstElementChild.src = './img/lowPrio.png';
}

function renderBoardPopUpEditContacts(task) {
    let div = document.getElementById(`boardPopUpEditColorfulContacts${task.createdAt}`);
    div.innerHTML = '';
    for (let i = 0; i < editTaskContacts.length; i++) {
        if(contacts.find(c => c.createdAt == editTaskContacts[i])) {
            let contact = contacts.find(c => c.createdAt == editTaskContacts[i]);
            div.innerHTML += /*html*/`<div class="initialsBoard" style="background-color: ${contact.color}; margin:0">${contact.initials}</div>`;
        }
    }
}

function renderBoardPopUpEditSubtasks(task) {
    let div = document.getElementById(`boardPopUpAllSubtasks`);
    div.innerHTML = '';
    for (let i = 0; i < editTaskSubtasks.length; i++) {
        let subtask = editTaskSubtasks[i];
        div.innerHTML += HTMLTemplatePopUpBoardEditSubtasks(i, subtask, task);
    }
}

function boardEditTaskAssignContacts(taskCreatedAt) {
    let div = document.getElementById('boardPopUpSelectContactsToAssignDiv');
    let input = document.getElementById('boardPopUpSelectContactsInput');

    div.classList.add('d-none');
    input.parentElement.classList.remove('d-none');
    input.focus();

    renderContactsForSearch("", taskCreatedAt);
}

function renderContactsForSearch(search, taskCreatedAt) {
    let contactsDiv = document.getElementById('boardPopUpSelectContacts');
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let contactsSearched = contacts.filter(contact => contact.firstName.toLowerCase().includes(search) || contact.lastName.toLowerCase().includes(search));
    contactsDiv.classList.remove('d-none');
    contactsDiv.innerHTML = '';
    for (let i = 0; i < contactsSearched.length; i++) {
        let contact = contactsSearched[i];
        contactsDiv.innerHTML += HTMLTemplatePopUpBoardEditSelectContacts(contact, task, search);
        if (editTaskContacts.find(c => c == contact.createdAt)) {
            let checkboxImg = document.getElementById(`boardEditTaskContactsCheckbox${contact.createdAt}`);
            checkboxImg.src = './img/checkedCheckboxWhite.png';
            checkboxImg.parentElement.style.color= "white";
            checkboxImg.parentElement.style.background= "#2A3647";
        }
    }
}

function boardEditTaskSearchContacts(taskCreatedAt) {
    let input = document.getElementById('boardPopUpSelectContactsInput');
    let search = input.value.toLowerCase();
    renderContactsForSearch(search, taskCreatedAt);
}

function closeBoardEditTaskContacts() {
    let input = document.getElementById('boardPopUpSelectContactsInput');
    let contactsDiv = document.getElementById('boardPopUpSelectContacts');
    let div = document.getElementById('boardPopUpSelectContactsToAssignDiv');
    input.parentElement.classList.add('d-none');
    contactsDiv.classList.add('d-none');
    div.classList.remove('d-none');
}

function boardEditTaskAddOrRemoveContact(contactCreatedAt, taskCreatedAt, search) {
    let checkboxImg = document.getElementById(`boardEditTaskContactsCheckbox${contactCreatedAt}`);
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let searchTranslated = search;
    if(!search) {
        searchTranslated = "";
    }
    if (checkboxImg.src.toLowerCase().includes('notchecked')) {
        editTaskContacts.push(contactCreatedAt);
        renderContactsForSearch(searchTranslated, taskCreatedAt);
        renderBoardPopUpEditContacts(task);
    } else {
        let index = editTaskContacts.indexOf(contactCreatedAt);
        editTaskContacts.splice(index, 1);
        renderContactsForSearch(searchTranslated, taskCreatedAt);
        renderBoardPopUpEditContacts(task);
    }
}

async function boardChangeSubtasksDoneOrNot(taskCreatedAt, i) {
    let subtaskCheckboxImg = document.getElementById(`boardPopUpSubtask${taskCreatedAt}${i}`);
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    if(subtaskCheckboxImg.src.toLowerCase().includes('notchecked')) {
        task.subtasks[i].done = true;
        renderSubtasksPopUpBoard(task);
        await setItem('tasks', tasks);
        renderAllTasks();
    } else {
        task.subtasks[i].done = false;
        renderSubtasksPopUpBoard(task);
        await setItem('tasks', tasks);
        renderAllTasks();
    }
}

function boardDeleteTask(taskCreatedAt) {
    let index = tasks.findIndex(t => t.createdAt == taskCreatedAt);
    tasks.splice(index, 1);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    renderAllTasks();
}

function focusOnInputOrAddSubtask(taskCreatedAt) {
    let input = document.getElementById('boardPopUpInputSubtasks');
    let search = input.value;
    if(search == '') {
        let boardPopUpInputSubtasksImg = document.getElementById('boardPopUpInputSubtasksImg');
        boardPopUpInputSubtasksImg.style.width = "40px";
        boardPopUpInputSubtasksImg.style.justifyContent = "space-between";
        boardPopUpInputSubtasksImg.style.paddingRight = "8px";
        boardPopUpInputSubtasksImg.innerHTML = '';
        boardPopUpInputSubtasksImg.innerHTML = /*html*/`<img onclick="changeImageOnSubtaskInputToPlus(${taskCreatedAt})" class="width12" src="./img/boardClose.png" alt="close">
            <div class="greyVerticalLineSubtasks"></div>
            <img onclick="boardEditTaskAddSubtask(${taskCreatedAt})" class="width14" src="./img/checkBlack.png" alt="check">
        `;
        focusOn('boardPopUpInputSubtasks');
    } else {
        boardEditTaskAddSubtask(taskCreatedAt);
    }
}

function changeImageOnSubtaskInputToPlus(taskCreatedAt) {
    let boardPopUpInputSubtasks = document.getElementById('boardPopUpInputSubtasks');
    let boardPopUpInputSubtasksImg = document.getElementById('boardPopUpInputSubtasksImg');
    boardPopUpInputSubtasks.value = '';
    boardPopUpInputSubtasksImg.style.width = "33px";
    boardPopUpInputSubtasksImg.style.justifyContent = "center";
    boardPopUpInputSubtasksImg.style.paddingRight = "0";
    boardPopUpInputSubtasksImg.innerHTML = '';
    boardPopUpInputSubtasksImg.innerHTML = /*html*/`<img onclick="focusOnInputOrAddSubtask('${taskCreatedAt}')" class="height10" src="./img/add-2.png" alt="plus">`;
}

async function boardEditTaskAddSubtask(taskCreatedAt) {
    let boardPopUpInputSubtasks = document.getElementById('boardPopUpInputSubtasks');
    if(boardPopUpInputSubtasks.value !== '') {
        let task = tasks.find(t => t.createdAt == taskCreatedAt);
        editTaskSubtasks.push({
            subtask: boardPopUpInputSubtasks.value,
            done: false
        });
        boardPopUpInputSubtasks.value = '';
        changeImageOnSubtaskInputToPlus(taskCreatedAt);
        renderBoardPopUpEditSubtasks(task);
    }
}

async function saveEditedTask(taskCreatedAt, event) {
    event.preventDefault();
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let title = document.getElementById('boardPopUpInputTitle').value;
    let description = document.getElementById('boardPopUpInputDescription').value;
    let date = document.getElementById('boardPopUpInputDate').value;
    task.title = title;
    task.description = description;
    task.date = date;
    task.prio = boardCurrentPrio;
    task.contacts = editTaskContacts;
    editTaskContacts = undefined;
    task.subtasks = editTaskSubtasks;
    editTaskSubtasks = undefined;
    openTask(taskCreatedAt);
    removeAnimationRightSlideIn('boardPopUpCard');
    await setItem('tasks', tasks);
    renderAllTasks();
}

function removeAnimationRightSlideIn(id) {
    let element = document.getElementById(id);
    element.classList.remove('animationRightSlideIn');
}

function showImgSubtasksDeleteAndEdit(i) {
    if(editEditSubtaskInputExists(i)) {
        let subtask = document.getElementById(`editTaskSubtask${i}`);
        subtask.classList.remove('d-none');
    }
}

function editEditSubtaskInputExists(i) {
    let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
    return !editEditSubtaskInput;
}

function hideImgSubtasksDeleteAndEdit(i) {
    if(editEditSubtaskInputExists(i)) {
        let subtask = document.getElementById(`editTaskSubtask${i}`);
        subtask.classList.add('d-none');
    }
}

function deleteEditTaskSubtask(i, taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    editTaskSubtasks.splice(i, 1);
    renderBoardPopUpEditSubtasks(task);
}

function editEditTaskSubtask(i, taskCreatedAt) {
    let editTaskSubtaskParent = document.getElementById(`editTaskSubtaskParent${i}`);
    editTaskSubtaskParent.classList.remove('hoverGrey');
    editTaskSubtaskParent.innerHTML = '';
    editTaskSubtaskParent.innerHTML = HTMLTemplatePopUpBoardEditSubtasksEdit(i, `${taskCreatedAt}`);
}

function editEditSubtaskInputValue(i, taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
    editTaskSubtasks[i].subtask = editEditSubtaskInput.value;
    renderBoardPopUpEditSubtasks(task);
}

function deleteEditTaskSubtask(i, taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    editTaskSubtasks.splice(i, 1);
    renderBoardPopUpEditSubtasks(task);
}

function setBlueBorderBottom(i) {
    let editTaskSubtaskParent = document.getElementById(`editTaskSubtaskParent${i}`);
    editTaskSubtaskParent.classList.add('blueBorderBottom');
}

function removeBlueBorderBottom(i) {
    let editTaskSubtaskParent = document.getElementById(`editTaskSubtaskParent${i}`);
    editTaskSubtaskParent.classList.remove('blueBorderBottom');
}

function addAnimationRightSlideIn(id) {
    let element = document.getElementById(id);
    element.classList.add('animationRightSlideIn');
}

/* ---------- OPEN ADD TASK ---------- */


async function openAddTask() {
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    boardTaskOverlay.innerHTML = HTMLTemplateAddTask();
    await includeHTML();
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    addTaskOverlay.innerHTML += `<img onclick="closeTask()" class="posAbsolute top45 right47 cursorPointer addTaskOverlayCloseImg" src="./img/Close.png" alt="close">`
}