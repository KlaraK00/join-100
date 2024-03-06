let tasks = [
    {   
        createdAt: '0990790667',
        title: 'title1',
        description: 'description1',
        contacts: ['1709724388780', '1709724616946'],
        date: '04.03.2024',
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
        contacts: ['1709724616946'],
        date: '04.03.2024',
        prio: 'urgent',
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
        contacts: ['1709724616946', '1709724388780'],
        date: '04.03.2024',
        prio: 'urgent',
        category: 'Technical Task',
        subtasks: [
            {
            subtask: 'subtask1',
            done: true
            },
            {
            subtask: 'subtask2',
            done: true 
            }
        ],
        status: 'done'
    },
    {
        createdAt: '0999790667',
        title: 'title4',
        description: 'description4',
        contacts: [],
        date: '04.03.2024',
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
        date: '04.03.2024',
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
    await includeHTML();
    await loadContacts();
    // await loadTasks(); => "tasks" vom remoteStorage
    highlightActiveSideButton();
    currentUser = getCurrentUser();
    showUserNavBar();
    renderAllTasks();
}

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
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
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
    let subtasksDone = getSubtasksDone(task);
    createNumbersForSubtasks(task, subtasksDone);
    createProgressBarForSubtasks(task, subtasksDone);
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
    let progressBarDiv = document.getElementById(`blueProgressBar${task.createdAt}`); 
    progressBarDiv.style.width = percentage;
}

function renderContactsBoard(task) {
    let div = document.getElementById(`contacts${task.createdAt}`);
    div.innerHTML = '';
    for (let i = 0; i < task.contacts.length; i++) {
        let contact = contacts.find(c => c.createdAt == task.contacts[i]);
        div.innerHTML += /*html*/`<div class="initialsBoard" style="background-color:${contact.color}">${contact.initials}</div>`;
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
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
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
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
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
        renderContactsBoard(task);
        renderPriorityAtBoard(task);
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
}

function closeTask() {
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
}

function renderContactsPopUpBoard(task) {
    let div = document.getElementById(`popUpContacts${task.createdAt}`);
    div.innerHTML = '';
    for (let i = 0; i < task.contacts.length; i++) {
        let contact = contacts.find(c => c.createdAt == task.contacts[i]);
        div.innerHTML += HTMLTemplatePopUpContact(contact);
    }
}

function renderSubtasksPopUpBoard(task) {
    let div = document.getElementById(`popUpSubtasks${task.createdAt}`);
    div.innerHTML = '';
    for (let i = 0; i < task.subtasks.length; i++) {
        let subtask = task.subtasks[i];
        div.innerHTML += HTMLTemplatePopUpSubtask(subtask);
    }
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