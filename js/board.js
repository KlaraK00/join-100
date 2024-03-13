tasks = [
    {   
        createdAt: '0990790667',
        title: 'title1',
        description: 'description1',
        contacts: [1709742165910, 1709742196208],
        date: '2024-03-30',
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
        date: '2024-03-30',
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
        contacts: [1709742196208, 1709742212979],
        date: '2024-04-25',
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
        date: '2024-05-13',
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
        date: '2024-05-30',
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
let boardCurrentPrio = '';
let editTaskContacts;
let editTaskSubtasks;
let draggingOnce = true;

// setToday();

// function setToday() {
//     let month = new Date().getMonth() + 1 + "";
//     let day = new Date().getDate() + "";
//     if (month.length == 1) {
//         month = "0" + month;
//     }
//     if (day.length == 1) {
//         day = "0" + day;
//     }
//     today = day + '/' + month + '/' + new Date().getFullYear;
//     // today = new Date().getFullYear() + '-' + month + '-' + day;
// }


async function initBoard() {
    loadLoggedIn();
    if(loggedIn) {
        await includeHTML();
        await loadContacts();
        // await loadTasks();
        highlightActiveSideButton();
        currentUser = getCurrentUser();
        showUserNavBar();
        renderAllTasks();
    } else {
        showLogInError();
    }
}

function renderAllTasks() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}

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


function startDragging(id) {
    draggingOnce = true;
    currentDraggedElement = id;
    let element = document.getElementById(id);
    element.style.transform = 'rotate(5deg)';
}

function allowDrop(event) {
    event.preventDefault();
}

function showEmptyDiv(id) {
    if(draggingOnce) {
        let element = document.getElementById(id);
        element.innerHTML += `<div id="${id}EmptyDiv" class="emptyDivForDraggedElement zIndexMinus1"></div>`;
        draggingOnce = false;
    }
}

function moveTo(newStatus) { 
    let id = currentDraggedElement.slice(currentDraggedElement.length -10);
    let element = tasks.find(task => task.createdAt == id);
    element.status = newStatus;
    renderAllTasks();
}

function removeEmptyDiv(id) {
    if(!draggingOnce) {
        let element = document.getElementById(`${id}EmptyDiv`);
        element.remove();
        draggingOnce = true;
    }
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
    renderDatePopUpBoard(task);
    renderContactsPopUpBoard(task);
    renderSubtasksPopUpBoard(task);
    renderPriorityPopUpBoard(task);
}

function closeTask() {
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    editTaskContacts = undefined;
    editTaskSubtasks = undefined;
}

function renderDatePopUpBoard(task) {
    let boardPopUpDate = document.getElementById('boardPopUpDate');
    if (task.date.includes('-')) {
        boardPopUpDate.innerHTML = getFormattedDate(task.date);
    }
}

function getFormattedDate(date) {
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10);
    let formattedDate = day + '/' + month + '/' + year;
    return formattedDate;
}

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
            popUpSubtasks.innerHTML += HTMLTemplatePopUpSubtask(task, subtask, i);
            renderSubtasksPopUpBoardCheckbox(task, i);
        }
    }
}

function renderSubtasksPopUpBoardCheckbox(task, i) {
    let subtaskCheckboxImg = document.getElementById(`boardPopUpSubtask${task.createdAt}${i}`);
    if(task.subtasks[i].done) {
        subtaskCheckboxImg.src = "./img/registerCheckedCheckbox.png";
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
    editTaskContacts = task.contacts.slice();
    editTaskSubtasks = task.subtasks.slice();
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
        div.innerHTML += /*html*/`<div onmouseout="hideImgSubtasksDeleteAndEdit(${i})" onmouseover="showImgSubtasksDeleteAndEdit(${i})" class="height17 hoverGrey padBot5 borderRadius10 padTop5 dFlex alignCenter justBetween">
                <li class="fontSize12 padLeft16 cursorPointer">${subtask.subtask}</li>
                <div id="editTaskSubtask${i}" class="dFlex directionRow padRight10">
                    <img class="height17" src="./img/edit-black.png" alt="edit">
                    <div class="greyVerticalLineSubtasks17 marLeft3"></div>
                    <img class="height17 marLeft3" src="./img/delete.png" alt="delete">
                </div>
            </div>
        `;
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

function boardChangeSubtasksDoneOrNot(taskCreatedAt, i) {
    let subtaskCheckboxImg = document.getElementById(`boardPopUpSubtask${taskCreatedAt}${i}`);
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    if(subtaskCheckboxImg.src.toLowerCase().includes('notchecked')) {
        task.subtasks[i].done = true;
        renderSubtasksPopUpBoard(task);
        renderAllTasks();
    } else {
        task.subtasks[i].done = false;
        renderSubtasksPopUpBoard(task);
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

function boardEditTaskAddSubtask(taskCreatedAt) {
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

function saveEditedTask(taskCreatedAt, event) {
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
    renderAllTasks();
}

function addAnimationRightSlideIn(id) {
    let element = document.getElementById(id);
    element.classList.add('animationRightSlideIn');
}

function removeAnimationRightSlideIn(id) {
    let element = document.getElementById(id);
    element.classList.remove('animationRightSlideIn');
}

function showImgSubtasksDeleteAndEdit(i) {
    let subtask = document.getElementById(`editTaskSubtask${i}`);
    subtask.classList.remove('d-none');
}

function hideImgSubtasksDeleteAndEdit(i) {
    let subtask = document.getElementById(`editTaskSubtask${i}`);
    subtask.classList.add('d-none');
}