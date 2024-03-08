tasks = [
    {   
        createdAt: '0990790667',
        title: 'title1',
        description: 'description1',
        contacts: ['1709742165910', '1709742196208'],
        date: '2014-03-04',
        prio: 'medium',
        category: 'User Story',
        subtasks: [
            {
            subtask: 'subtask1',
            done: false
            },
            {
            subtask: 'subtask2',
            done: false 
            }
        ],
        status: 'done'
    },
    {
        createdAt: '0990790669',
        title: 'title2',
        description: 'description2',
        contacts: [],
        date: '2014-03-04',
        prio: '',
        category: 'Technical Task',
        subtasks: [
            {
            subtask: 'subtask1',
            done: false
            },
            {
            subtask: 'subtask2',
            done: true 
            }
        ],
        status: 'toDo'
    },
    {
        createdAt: '0990798667',
        title: 'title3',
        description: 'description3',
        contacts: ['1709742196208', '1709742212979'],
        date: '2014-03-04',
        prio: 'urgent',
        category: 'Technical Task',
        subtasks: [],
        status: 'done'
    },
    {
        createdAt: '0999790667',
        title: 'title4',
        description: 'description4',
        contacts: [],
        date: '2014-03-04',
        prio: '',
        category: 'User Story',
        subtasks: [],
        status: 'inProgress'
    },
    {
        createdAt: '9990790667',
        title: 'title5',
        description: 'description5',
        contacts: [],
        date: '2014-03-04',
        prio: 'medium',
        category: 'Technical Task',
        subtasks: [
            {
            subtask: 'subtask1',
            done: false
            },
            {
            subtask: 'subtask2',
            done: false 
            },
            {
            subtask: 'subtask3',
            done: true 
            }
        ],
        status: 'awaitFeedback'
    }
]
let currentDraggedElement;

async function initBoard() {
    loggedIn = getLoggedIn();
    // if(loggedIn) {
        await includeHTML();
        await loadContacts();
        // await loadTasks();
        highlightActiveSideButton();
        currentUser = getCurrentUser();
        showUserNavBar();
        renderAllTasks();
    // } else {
    //     console.log("no");
    // }
}

let boardCurrentPrio = '';

function renderAllTasks() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}

function renderToDo() {
    let allTasksToDo = tasks.filter(task => task.status == 'toDo');
    let divToDo = document.getElementById('divToDo');
    divToDo.innerHTML = '';
    for (let i = 0; i < allTasksToDo.length; i++) {
        let task = allTasksToDo[i];
        divToDo.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsAndPriorityBoard(task);
    }
}

function categoryBackground(task, id) {
    let div = document.getElementById(id);
    if (task.category == 'Technical Task') {
        div.classList.add('technicalTaskBg');
    } else {
        div.classList.add('userStoryBg');
    }
}

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

function getSubtasksDone(task) {
    let subtasksDone = task.subtasks.filter(subtask => subtask.done);
    return subtasksDone.length;
}

function createNumbersForSubtasks(task, subtasksDone) {
    let howManySubtasksDoneDiv = document.getElementById(`subtasksBoard${task.createdAt}`);
    howManySubtasksDoneDiv.innerHTML = '';
    howManySubtasksDoneDiv.innerHTML = `${subtasksDone}/${task.subtasks.length} Subtasks`;
}

function createProgressBarForSubtasks(task, subtasksDone) {
    let percentage = subtasksDone / task.subtasks.length * 100 + '%';
    let blueProgressBarDiv = document.getElementById(`blueProgressBar${task.createdAt}`); 
    let greyProgressBarDiv = document.getElementById(`greyProgressBar${task.createdAt}`); 
    blueProgressBarDiv.style.width = percentage;
    greyProgressBarDiv.style.width = "100%";
}

function renderContactsAndPriorityBoard(task) {
    if((!task.contacts || task.contacts == "") && (!task.prio || task.prio == "")) {
        removeContactsAndPriorityDiv(task);
    } else {
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
    }
}

function removeContactsAndPriorityDiv(task) {
    let divOfContactsAnPriority = document.getElementById(`contacts${task.createdAt}`).parentElement;
    divOfContactsAnPriority.remove();
}

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

function renderPriorityAtBoard(task) {
    let div = document.getElementById(`priority${task.createdAt}`);
    div.innerHTML = '';
    if (priorityExistsAtBoard(task)) {
        let priority = task.prio;
        div.innerHTML = /*html*/`<img src="./img/${priority}Prio.png">`;
    }
}

function priorityExistsAtBoard(task) {
    return task.prio !== '';
}

function renderInProgress() {
    let allTasksInProgress = tasks.filter(task => task.status == 'inProgress');
    let divInProgress = document.getElementById('divInProgress');
    divInProgress.innerHTML = '';
    for (let i = 0; i < allTasksInProgress.length; i++) {
        let task = allTasksInProgress[i];
        divInProgress.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsAndPriorityBoard(task);
    }
}

function renderAwaitFeedback() {
    let allTasksAwaitFeedback = tasks.filter(task => task.status == 'awaitFeedback');
    let divAwaitFeedback = document.getElementById('divAwaitFeedback');
    divAwaitFeedback.innerHTML = '';
    for (let i = 0; i < allTasksAwaitFeedback.length; i++) {
        let task = allTasksAwaitFeedback[i];
        divAwaitFeedback.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsAndPriorityBoard(task);
    }
}

function renderDone() {
    let allTasksDone = tasks.filter(task => task.status == 'done');
    let divDone = document.getElementById('divDone');
    divDone.innerHTML = '';
    for (let i = 0; i < allTasksDone.length; i++) {
        let task = allTasksDone[i];
        divDone.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
        renderContactsAndPriorityBoard(task);
    }
}

/* ---------- drag and drop ---------- */


function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTo(newStatus) { 
    let id = currentDraggedElement.slice(currentDraggedElement.length -10);
    let element = tasks.find(task => task.createdAt == id);
    element.status = newStatus;
    renderAllTasks();
}

/* ---------- search ---------- */

function searchAllTasks() {
    let search = document.getElementById('boardSearchInput').value;
    if(boardInputIsEmpty(search)) {
        renderAllTasks();
    } else {
        renderAllSearchedTasks(search);
    }
}

function boardInputIsEmpty(search) {
    return search == '';
}

function renderAllSearchedTasks(search) {
    renderSearchedToDo(search);
    renderSearchedInProgress(search);
    renderSearchedAwaitFeedback(search);
    rendeSearchedDone(search);
}

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

/* ---------- open task ---------- */

function openTask(taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    boardTaskOverlay.innerHTML = HTMLTemplatePopUpTask(task);
    categoryBackground(task, `boardPopUpCategory${task.createdAt}`);
    renderContactsPopUpBoard(task);
    renderSubtasksPopUpBoard(task);
    renderPriorityPopUpBoard(task);
}

function closeTask() {
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
}

function renderContactsPopUpBoard(task) {
    if(task.contacts == "") {
        removeContactsPopUpBoard(task);
    } else {
        let div = document.getElementById(`popUpContacts${task.createdAt}`);
        div.innerHTML = '';
        for (let i = 0; i < task.contacts.length; i++) {
            if(contacts.find(c => c.createdAt == task.contacts[i])){
                let contact = contacts.find(c => c.createdAt == task.contacts[i]);
                div.innerHTML += HTMLTemplatePopUpContact(contact);
            }
        }
    }
}

function removeContactsPopUpBoard(task) {
    let divOfContacts = document.getElementById(`popUpContacts${task.createdAt}`).parentElement;
    divOfContacts.remove();
}

function renderSubtasksPopUpBoard(task) {
    if(task.subtasks == "") {
        let popUpSubtasksParent = document.getElementById(`popUpSubtasks${task.createdAt}`).parentElement;
        popUpSubtasksParent.remove();
    } else {
        let popUpSubtasks = document.getElementById(`popUpSubtasks${task.createdAt}`);
        popUpSubtasks.innerHTML = '';
        for (let i = 0; i < task.subtasks.length; i++) {
            let subtask = task.subtasks[i];
            popUpSubtasks.innerHTML += HTMLTemplatePopUpSubtask(subtask);
        }
    }
}

function renderPriorityPopUpBoard(task) {
    if(task.prio == '') {
        removePopUpPrioDiv(task);
    } else {
        let popUpBoardPriorityDiv = document.getElementById(`boardPopUpPriority${task.createdAt}`);
        popUpBoardPriorityDiv.innerHTML = HTMLTemplatePopUpPriority(task);
    }
}

function removePopUpPrioDiv(task) {
    let popUpBoardPriorityDiv = document.getElementById(`boardPopUpPriority${task.createdAt}`);
    popUpBoardPriorityDiv.remove();
}

// checkbox.src = './img/checkboxNotChecked.png';
// } else {
//     checkbox.src = './img/registerCheckedCheckbox.png';

function changeBoardTaskPopUpEditToBlue() {
    let img = document.getElementById('boardTaskPopUpEditImg');
    let span = document.getElementById('boardTaskPopUpEditSpan');
    img.src = "./img/edit-blue.png";
    span.style.color = "#29ABE2";
    span.style.fontWeight = "bold";
}

function changeBoardTaskPopUpEditToBlack() {
    let img = document.getElementById('boardTaskPopUpEditImg');
    let span = document.getElementById('boardTaskPopUpEditSpan');
    img.src = "./img/edit-black.png";
    span.style.color = "#000000";
    span.style.fontWeight = "400";
}

function changeBoardTaskPopUpDeleteToBlue() {
    let img = document.getElementById('boardTaskPopUpDeleteImg');
    let span = document.getElementById('boardTaskPopUpDeleteSpan');
    img.src = "./img/delete-blue.png";
    span.style.color = "#29ABE2";
    span.style.fontWeight = "bold";
}

function changeBoardTaskPopUpDeleteToBlack() {
    let img = document.getElementById('boardTaskPopUpDeleteImg');
    let span = document.getElementById('boardTaskPopUpDeleteSpan');
    img.src = "./img/delete.png";
    span.style.color = "#000000";
    span.style.fontWeight = "400";
}

/* ---------- edit task ---------- */

function boardPopUpEdit(id) {
    let task = tasks.find(t => t.createdAt == id);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    boardTaskOverlay.innerHTML = HTMLTemplatePopUpBoardEdit(task);
    renderBoardPopUpEditPrio(task);
    renderBoardPopUpEditContacts(task);
    renderBoardPopUpEditSubtasks(task);
}

function renderBoardPopUpEditPrio(task) {
    boardCurrentPrio = task.prio;
    changePrioBtn(boardCurrentPrio);
}

function changePrioBtn(priority) {
    if(priority == 'urgent') {
        changePrioBtnUrgent();
    } else if (priority == 'medium') {
        changePrioBtnMedium();
    } else if (priority == 'low') {
        changePrioBtnLow();
    } else {
        cleanAllPrioBtns();
    }
}

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

function cleanAllPrioBtns() {
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
    for (let i = 0; i < task.contacts.length; i++) {
        if(contacts.find(c => c.createdAt == task.contacts[i])) {
            let contact = contacts.find(c => c.createdAt == task.contacts[i]);
            div.innerHTML += /*html*/`<div class="initialsBoard" style="background-color: ${contact.color}; margin:0">${contact.initials}</div>`;
        }
    }
}

function renderBoardPopUpEditSubtasks(task) {
    let div = document.getElementById(`boardPopUpAllSubtasks`);
    div.innerHTML = '';
    for (let i = 0; i < task.subtasks.length; i++) {
        let subtask = task.subtasks[i];
        div.innerHTML += /*html*/`<li class="fontSize12">${subtask.subtask}</li>`;
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
        if (task.contacts.find(c => c == contact.createdAt + '')) {
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
        task.contacts.push(contactCreatedAt);
        renderContactsForSearch(searchTranslated, taskCreatedAt);
        renderBoardPopUpEditContacts(task);
    } else {
        let index = task.contacts.indexOf(contactCreatedAt + "");
        task.contacts.splice(index, 1);
        renderContactsForSearch(searchTranslated, taskCreatedAt);
        renderBoardPopUpEditContacts(task);
    }
}