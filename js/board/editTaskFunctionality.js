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
 * Prevents the submitting from the forumlar and adds a subtask if the key "enter" is pressed and the value of the input is not empty.
 * 
 * @param {Event} event - The event object representing the key-down-event.
 * @param {string} taskCreatedAt - An unique long number to identify the correct task.
 */
function addSubtaskOnEnter(event, taskCreatedAt) {
    if(event.keyCode == 13) {
        event.preventDefault();
        boardEditTaskAddSubtask(taskCreatedAt);
    }
}

/**
 * Stores the information of the formular as task-object in the remote storage and also informs the user of the successful editing.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task. 
 * @param {Event} event - The event object for preventing a reload of the formular.
 */
async function processEditedTask(taskCreatedAt, event) {
    event.preventDefault();
    await savingProcessEditedTask(taskCreatedAt);
    renderProcessEditedTask(taskCreatedAt);
}

/**
 * Presents the saving-process of the edited task.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
async function savingProcessEditedTask(taskCreatedAt) {
    disableEditingTaskButton();
    overwriteTask(taskCreatedAt);
    await saveTask();
    showSuccessfulEditing(taskCreatedAt);
    enableEditingTaskButton();
}

/**
 * Disables the editing-button and also removes the hover-effect.
 */
function disableEditingTaskButton() {
    let button = document.getElementById('editingTaskSaveButton');
    button.disabled = true;
    button.classList.remove('darkBtn');
    button.classList.add('darkBtnWithoutHover');
}

/**
 * Overwrites the value of the current task with the edited values from the inputs from the edit-task-overlay.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task. 
 */
function overwriteTask(taskCreatedAt) {
    let task = tasks.find(t => t.createdAt == taskCreatedAt);
    let title = document.getElementById('boardPopUpInputTitle').value;
    let description = document.getElementById('boardPopUpInputDescription').value;
    let date = document.getElementById('boardPopUpInputDate').value;
    task.title = title;
    task.description = description;
    task.date = getDateWithHyphen(date);
    task.prio = boardCurrentPrio;
    task.contacts = editTaskContacts;
    editTaskContacts = undefined;
    task.subtasks = editTaskSubtasks;
    editTaskSubtasks = undefined;
}

/**
 * Returns a date string with in an dd/mm/yyyy-format.
 * 
 * @param {string} date - Uses the edited date as parameter.
 * @returns {string} - Returns the formatted date if the parameter includes a format with '/'.
 */
function getDateWithHyphen(date) {
    if(date.includes('/')) {
        let dateArray = date.split('/');
        let day = dateArray[0];
        let month = dateArray[1];
        let year = dateArray[2];
        let formattedDate = year + '-' + month + '-' + day;
        return formattedDate;
    } else {
        return date;
    }
}

/**
 * Stores the array "tasks" under the key "tasks" in the remote storage.
 */
async function saveTask() {
    await setItem('tasks', tasks);
}

/**
 * Shows that the editing was successful by displaying a notification for a small amount of time.
 */
function showSuccessfulEditing() {
    let informOverlay =  document.getElementById('informationOverlayEditingTask');
    informOverlay.classList.remove('d-none');
    setTimeout(() => {
        informOverlay.classList.add('d-none');
    }, 2000);
}

/**
 * Enables the editing-task-button and adds hover-effect.
 */
function enableEditingTaskButton() {
    let button = document.getElementById('editingTaskSaveButton');
    button.disabled = false;
    button.classList.remove('darkBtnWithoutHover');
    button.classList.add('darkBtn');
}

/**
 * Closes the edit-task-overview and opens the open-task-overview.
 * It also renders all tasks in the background.
 * 
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
 */
function renderProcessEditedTask(taskCreatedAt) {
    openTask(taskCreatedAt);
    removeAnimationRightSlideIn('boardPopUpCard');
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
    let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
    editEditSubtaskInput.focus();
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

/**
 * Closes the specific assinged-to-content.
 */
function closeAssignedToDiv() {
    closeBoardEditTaskContacts();
}