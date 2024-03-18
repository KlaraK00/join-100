/**
 * Opens the task-overlay-view for editing. 
 * 
 * @param {string} id - Uses the id of a specific task.
 */
function boardPopUpEdit(id) {
    let task = tasks.find(t => t.createdAt == id);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    boardTaskOverlay.innerHTML = HTMLTemplatePopUpBoardEdit(task);
    editTaskContacts = task.contacts.slice(); // deep copy task.contacts array
    editTaskSubtasks = JSON.parse(JSON.stringify(task.subtasks)); // deep copy task.subtasks array
    renderBoardPopUpEditDate(task);
    renderBoardPopUpEditPrio(task);
    renderBoardPopUpEditContacts(task);
    renderBoardPopUpEditSubtasks(task);
    startEventListenerBoardEditPopUp();
}

/**
 * Renders the date for the task-overlay-view for editing.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderBoardPopUpEditDate(task) {
    let boardPopUpInputDate = document.getElementById('boardPopUpInputDate');
    if (task.date.includes('-')) {
        boardPopUpInputDate.value = getFormattedDate(task.date);
    }
}

/**
 * Renders the priority for the task-overlay-view for editing.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderBoardPopUpEditPrio(task) {
    boardCurrentPrio = task.prio;
    changePrioBtn(boardCurrentPrio);
}

/**
 * Changes the right priority-button for the task-overlay-view for editing.
 * 
 * @param {string} priority - Passes the priority.
 * @param {string} taskCreatedAt - Uses a unique long number as parameter to identify the specific task.
 */
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

/**
 * Changes the priority-button for the task-overlay-view for editing to "urgent".
 */
function changePrioBtnUrgent() {
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

/**
 * Changes the priority-button for the task-overlay-view for editing to "medium".
 */
function changePrioBtnMedium() {
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

/**
 * Changes the priority-button for the task-overlay-view for editing to "low".
 */
function changePrioBtnLow() {
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

/**
 * Cleans the priority-button for the task-overlay-view for editing.
 */
function cleanAllPrioBtns() {
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

/**
 * Renders the contacts for the editing-task-overlay-view.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
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

/**
 * Renders the subtasks for the editing-task-overlay-view.
 * 
 * @param {object} task - Uses the task-object as a parameter to address the right task-data.
 */
function renderBoardPopUpEditSubtasks(task) {
    let div = document.getElementById(`boardPopUpAllSubtasks`);
    div.innerHTML = '';
    for (let i = 0; i < editTaskSubtasks.length; i++) {
        let subtask = editTaskSubtasks[i];
        div.innerHTML += HTMLTemplatePopUpBoardEditSubtasks(i, subtask, task);
    }
}

/**
 * Checks if you click outside of the contacts-area to close the contacts.
 */
function startEventListenerBoardEditPopUp() {
    document.getElementById('popUpBoardEdit').addEventListener("click", function (event) {
        if (!document.getElementById('boardPopUpSelectContacts').contains(event.target) && !document.getElementById('boardPopUpSelectContactsToAssignDiv').contains(event.target)) {
            closeBoardEditTaskContacts();
        }
    })
}

/**
 * Renders the contacts for the editing-task-overlay-view.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function boardEditTaskAssignContacts(taskCreatedAt) {
    let div = document.getElementById('boardPopUpSelectContactsToAssignDiv');
    let input = document.getElementById('boardPopUpSelectContactsInput');

    div.classList.add('d-none');
    input.parentElement.classList.remove('d-none');
    input.focus();

    renderContactsForSearch("", taskCreatedAt);
}

/**
 * Renders the searched contacts for the editing-taks-overlay-view.
 * 
 * @param {string} search - Passes the searched value.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
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

/**
 * Renders the searched contacts for the editing-taks-overlay-view.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function boardEditTaskSearchContacts(taskCreatedAt) {
    let input = document.getElementById('boardPopUpSelectContactsInput');
    let search = input.value.toLowerCase();
    renderContactsForSearch(search, taskCreatedAt);
}

/**
 * Closes the dropdown where all contacts are showed. This happens in the editing-task-overlay-view.
 */
function closeBoardEditTaskContacts() {
    let input = document.getElementById('boardPopUpSelectContactsInput');
    let contactsDiv = document.getElementById('boardPopUpSelectContacts');
    let div = document.getElementById('boardPopUpSelectContactsToAssignDiv');
    input.parentElement.classList.add('d-none');
    contactsDiv.classList.add('d-none');
    div.classList.remove('d-none');
}