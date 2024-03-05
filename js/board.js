let tasks = [
    {   
        createdAt: '0990790667',
        title: 'title1',
        description: 'description1',
        contacts: ['contact1', 'contact2'],
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
        contacts: ['contact1', 'contact2'],
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
        contacts: ['contact1', 'contact2'],
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
        contacts: ['contact1', 'contact2'],
        date: '04.03.2024',
        prio: 'low',
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
        status: 'inProgress'
    },
    {
        createdAt: '9990790667',
        title: 'title5',
        description: 'description5',
        contacts: ['contact1', 'contact2'],
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

function renderInProgress() {
    let allTasksInProgress = tasks.filter(task => task.status == 'inProgress');
    let divInProgress = document.getElementById('divInProgress');
    divInProgress.innerHTML = '';
    for (let i = 0; i < allTasksInProgress.length; i++) {
        let task = allTasksInProgress[i];
        divInProgress.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
        renderSubtasks(task);
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
    }
}