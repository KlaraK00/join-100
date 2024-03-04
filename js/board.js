let tasks = [
    {   
        createdAt: '099079066',
        title: 'title1',
        description: 'description1',
        contacts: ['contact1', 'contact2'],
        date: '04.03.2024',
        prio: 'medium',
        category: 'User Story',
        subtasks: ['subtask1', 'subtask2'],
        status: 'done'
    },
    {
        createdAt: '099079064',
        title: 'title2',
        description: 'description2',
        contacts: ['contact1', 'contact2'],
        date: '04.03.2024',
        prio: 'urgent',
        category: 'Technical Task',
        subtasks: ['subtask1', 'subtask2'],
        status: 'toDo'
    },
    {
        createdAt: '099079067',
        title: 'title3',
        description: 'description3',
        contacts: ['contact1', 'contact2'],
        date: '04.03.2024',
        prio: 'urgent',
        category: 'Technical Task',
        subtasks: ['subtask1', 'subtask2'],
        status: 'done'
    },
    {
        createdAt: '0990790668',
        title: 'title4',
        description: 'description4',
        contacts: ['contact1', 'contact2'],
        date: '04.03.2024',
        prio: 'low',
        category: 'User Story',
        subtasks: ['subtask1', 'subtask2'],
        status: 'inProgress'
    },
    {
        createdAt: '099079069',
        title: 'title5',
        description: 'description5',
        contacts: ['contact1', 'contact2'],
        date: '04.03.2024',
        prio: 'medium',
        category: 'Technical Task',
        subtasks: ['subtask1', 'subtask2'],
        status: 'awaitFeedback'
    }
]

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

function renderInProgress() {
    let allTasksInProgress = tasks.filter(task => task.status == 'inProgress');
    let divInProgress = document.getElementById('divInProgress');
    divInProgress.innerHTML = '';
    for (let i = 0; i < allTasksInProgress.length; i++) {
        let task = allTasksInProgress[i];
        divInProgress.innerHTML += HTMLTemplateTask(task);
        categoryBackground(task, `boardCategory${task.createdAt}`);
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
    }
}