/**
 * Checks if there is an empty search-value.
 * If so it renders all contacts by also showing which are checked.
 * If not it renders all searched contacts by also showing which are checked.
 * 
 * @param {string} contactCreatedAt - Passes a unique long number to identify a specific contact.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 * @param {string} search - Passes the searched value.
 */
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

/**
 * Checks if subtasks are done or not.
 * If so, the checkbox is checked.
 * If not, there is an empty checkbox.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 * @param {number} i - Passes the index of a subtask.
 */
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

/**
 * Deletes a specific task for the overall-board-view.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function boardDeleteTask(taskCreatedAt) {
    let index = tasks.findIndex(t => t.createdAt == taskCreatedAt);
    tasks.splice(index, 1);
    let boardTaskOverlay = document.getElementById('boardTaskOverlay');
    boardTaskOverlay.innerHTML = '';
    renderAllTasks();
}

/**
 * Checks if the search-input is empty.
 * If so it focuses on the input.
 * If not it adds a subtask which has the value of the input.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
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

/**
 * Changes the image from the input to plus.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
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

/**
 * Adds a subtask on the edit-task-overlay-view.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task. 
 */
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

/**
 * Stores the information of the formular as task-object in the remote storage.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task. 
 * @param {Event} event - The event object for preventin a reload of the formular.
 */
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

/**
 * Removes the animation "rightSlideIn" from an element.
 * 
 * @param {string} id - Passes the id from a specific element.
 */
function removeAnimationRightSlideIn(id) {
    let element = document.getElementById(id);
    element.classList.remove('animationRightSlideIn');
}

/**
 * Shows the delete-image and the edit-image on a specific subtask.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function showImgSubtasksDeleteAndEdit(i) {
    if(editEditSubtaskInputExists(i)) {
        let subtask = document.getElementById(`editTaskSubtask${i}`);
        subtask.classList.remove('d-none');
    }
}

/**
 * Checks if the specific input exists.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 * @returns {boolean} . Returns "true" if the specific input exists and "false" if it doesn't.
 */
function editEditSubtaskInputExists(i) {
    let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
    return !editEditSubtaskInput;
}

/**
 * Hides the delete-image and edit-image.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function hideImgSubtasksDeleteAndEdit(i) {
    if(editEditSubtaskInputExists(i)) {
        let subtask = document.getElementById(`editTaskSubtask${i}`);
        subtask.classList.add('d-none');
    }
}

/**
 * Deletes a specific subtask for the editing-task-overlay-view.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function deleteEditTaskSubtask(i, taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    editTaskSubtasks.splice(i, 1);
    renderBoardPopUpEditSubtasks(task);
}

/**
 * Changes specific element to an input where the value of the subtask can be changed.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task. 
 */
function editEditTaskSubtask(i, taskCreatedAt) {
    let editTaskSubtaskParent = document.getElementById(`editTaskSubtaskParent${i}`);
    editTaskSubtaskParent.classList.remove('hoverGrey');
    editTaskSubtaskParent.innerHTML = '';
    editTaskSubtaskParent.innerHTML = HTMLTemplatePopUpBoardEditSubtasksEdit(i, `${taskCreatedAt}`);
}

/**
 * Sets the value for a specific subtask.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function editEditSubtaskInputValue(i, taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
    editTaskSubtasks[i].subtask = editEditSubtaskInput.value;
    renderBoardPopUpEditSubtasks(task);
}

/**
 * Deletes a specific subtask.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function deleteEditTaskSubtask(i, taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    editTaskSubtasks.splice(i, 1);
    renderBoardPopUpEditSubtasks(task);
}

/**
 * Adds blue border to a specific element.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function setBlueBorderBottom(i) {
    let editTaskSubtaskParent = document.getElementById(`editTaskSubtaskParent${i}`);
    editTaskSubtaskParent.classList.add('blueBorderBottom');
}

/**
 * Removes the blue border from a specific element.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 */
function removeBlueBorderBottom(i) {
    let editTaskSubtaskParent = document.getElementById(`editTaskSubtaskParent${i}`);
    editTaskSubtaskParent.classList.remove('blueBorderBottom');
}

/**
 * Adds the animation "rightSlideIn" to an specific element.
 * 
 * @param {string} id - Passes the id from a specific element.
 */
function addAnimationRightSlideIn(id) {
    let element = document.getElementById(id);
    element.classList.add('animationRightSlideIn');
}