// Function to handle adding a subtask from input or click event
/**
 * Handles the addition of a new subtask to the subtasks list.
 * Gets the subtask text from the input field, adds it to the list,
 * and clears the input field.
 */
function handleAddSubtask() {
  const subtasksInput = document.getElementById("subtasks");
  const subtaskText = subtasksInput.value.trim();
  
  if (subtaskText) {
    addSubtaskToList(subtaskText);
    subtasksInput.value = ""; // Clear input field
  }
}
  
/**
 * Creates a wrapper div for a subtask with the given text.
 * @param {string} subtaskText - The text content of the subtask.
 * @returns {HTMLDivElement} The created subtask wrapper element.
*/
function createSubtaskWrapper(subtaskText) {
  const subtaskWrapper = document.createElement("div");
  subtaskWrapper.classList.add("subtask-wrapper");
  const li = createSubtaskListItem(subtaskText);
  const actionsDiv = createSubtaskActionsDiv();
  appendElements(subtaskWrapper, li, actionsDiv);
  return subtaskWrapper;
}
  
/**
 * Creates a list item for the subtask text.
 * @param {string} subtaskText - The text content of the subtask.
 * @returns {HTMLLIElement} The created subtask list item element.
*/
function createSubtaskListItem(subtaskText) {
  const li = document.createElement("li");
  li.textContent = subtaskText;
  li.classList.add("subtask-text");
  return li;
}
  
/**
 * Creates a div element for the subtask actions.
 * @returns {HTMLDivElement} The created subtask actions div element.
*/
function createSubtaskActionsDiv() {
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("subtask-actions", "d-none");
  return actionsDiv;
}
  
/**
 * Adds edit and delete action buttons to the given actions div, with associated click handlers.
 * @param {HTMLDivElement} actionsDiv - The div element to which the action buttons will be appended.
 * @param {HTMLLIElement} li - The list item element associated with the subtask.
*/
function addEditAndDeleteActions(actionsDiv, li) {
  const editImage = createActionButton("img/edit-black.png", "edit-action", () => {
    hideActionButtons();
    openEditField(li);
  });
  const deleteImage = createActionButton("img/delete.png", "delete-action", () => {
    deleteSubtask(li);
  });
  appendElements(actionsDiv, editImage, deleteImage);
}
  
/**
 * Creates an action button with the specified image source, class, and click event listener.
 * @param {string} imageSrc - The source URL of the image.
 * @param {string} className - The class name to apply to the action button.
 * @param {Function} clickHandler - The function to be executed when the button is clicked.
 * @returns {HTMLImageElement} The created action button element.
*/
function createActionButton(imageSrc, className, clickHandler) {
  const actionButton = document.createElement("img");
  actionButton.src = imageSrc;
  actionButton.classList.add(className);
  actionButton.addEventListener("click", clickHandler);
  return actionButton;
}
  
/**
 * Appends multiple child elements to a parent element.
 * @param {HTMLElement} parent - The parent element to which children will be appended.
 * @param {...HTMLElement} children - The child elements to append to the parent.
*/
function appendElements(parent, ...children) {
  children.forEach(child => parent.appendChild(child));
}
  
/**
 * Shows the action buttons associated with a subtask when hovering over it.
 * @param {HTMLDivElement} subtaskWrapper - The wrapper div element for the subtask.
 * @param {HTMLDivElement} actionsDiv - The div element containing the action buttons.
*/
function showActionButtons(subtaskWrapper, actionsDiv) {
  if (!subtaskWrapper.classList.contains("editing")) {
    actionsDiv.classList.remove("d-none");
  }
}
  
/**
 * Hides the action buttons associated with a subtask when not hovering over it.
 * @param {HTMLDivElement} subtaskWrapper - The wrapper div element for the subtask.
 * @param {HTMLDivElement} actionsDiv - The div element containing the action buttons.
*/
function hideActionButtons(subtaskWrapper, actionsDiv) {
  if (!subtaskWrapper.classList.contains("editing")) {
    actionsDiv.classList.add("d-none");
  }
}
  
/**
 * Adds event listeners to show and hide action buttons on hovering over a subtask.
 * @param {HTMLDivElement} subtaskWrapper - The wrapper div element for the subtask.
 * @param {HTMLDivElement} actionsDiv - The div element containing the action buttons.
*/
function addHoverEventListeners(subtaskWrapper, actionsDiv) {
  subtaskWrapper.addEventListener("mouseenter", () => showActionButtons(subtaskWrapper, actionsDiv));
  subtaskWrapper.addEventListener("mouseleave", () => hideActionButtons(subtaskWrapper, actionsDiv));
}
  
/**
 * Adds a subtask with the given text to the subtasks list.
 * @param {string} subtaskText - The text content of the subtask to be added.
*/
function addSubtaskToList(subtaskText) {
  const subtasksList = document.getElementById("subtasksList");
  const subtaskWrapper = createSubtaskWrapper(subtaskText);
  const li = subtaskWrapper.querySelector(".subtask-text");
  const actionsDiv = subtaskWrapper.querySelector(".subtask-actions");
  addEditAndDeleteActions(actionsDiv, li);
  addHoverEventListeners(subtaskWrapper, actionsDiv);
  subtasksList.appendChild(subtaskWrapper);
  li.addEventListener("dblclick", () => {
      openEditField(li);
    });
}

/**
 * Add 'editing' class to the subtask wrapper and create an edit field with options.
 * @param {HTMLElement} li - The list item element to edit.
*/
function openEditField(li) {
  // Create wrapper div for the edit field
  const wrapper = createEditFieldWrapper(li);
    
  // Create edit input field
  const editInput = createEditInput(li.textContent);
    
  // Create save, delete, and confirm buttons
  const saveButton = createImageButton("img/edit.png", "edit-btn", () => saveEdit(li, editInput.value));
  const deleteButton = createImageButton("img/delete.png", "delete-btn", () => deleteSubtask(li));
  const confirmButton = createImageButton("img/tick.png", "confirm-btn", () => saveEdit(li, editInput.value));
  
  // Append elements to the wrapper
  appendElements(wrapper, editInput, saveButton, deleteButton, confirmButton);
  
  // Clear the list item content and append the wrapper
  li.innerHTML = "";
  li.appendChild(wrapper);
}

/**
 * Create a wrapper div to hold the input field and the images.
 * @param {HTMLElement} li - The list item element.
 * @returns {HTMLElement} - The wrapper div element.
*/
function createEditFieldWrapper(li) {
    const wrapper = document.createElement("div");
    wrapper.className = "edit-field-wrapper"; // CSS class for styling
    li.closest(".subtask-wrapper").classList.add("editing");
    return wrapper;
}

/**
 * Create an input field for editing.
 * @param {string} textContent - The initial text content for the input field.
 * @returns {HTMLInputElement} - The created input element.
*/
function createEditInput(textContent) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = textContent;
  editInput.className = "edit-input"; // CSS class for styling
  return editInput;
}

/**
 * Create an image button with the given image source, class, and click event listener.
 * @param {string} imageSrc - The source URL for the image.
 * @param {string} className - The CSS class for the button.
 * @param {Function} clickHandler - The click event handler function.
 * @returns {HTMLImageElement} - The created image element.
*/
function createImageButton(imageSrc, className, clickHandler) {
  const button = document.createElement("img");
  button.src = imageSrc;
  button.className = className;
  button.addEventListener("click", clickHandler);
  return button;
}

/**
 * Save the edited value and update the list item text.
 * @param {HTMLElement} li - The list item element to save the edit for.
 * @param {string} newValue - The new value to set for the list item text.
*/
function saveEdit(li, newValue) {
  li.textContent = newValue; // Update the list item text
  li.closest(".subtask-wrapper").classList.remove("editing");
  li.addEventListener("dblclick", () => openEditField(li)); // Add double-click listener again
}

/**
 * Delete the subtask associated with the given list item.
 * @param {HTMLElement} li - The list item element to delete.
*/
function deleteSubtask(li) {
  li.closest(".subtask-wrapper").classList.remove("editing");
  li.remove(); // Remove the list item
}

/**
 * Validate the input value for a date field.
 * @param {Event} event - The input event.
*/
function isValidDateInput(event) {
  const dateString = event.target.value;
  // Validation logic remains the same, just ensure it's using dateString from the event
  // ...
}

/**
 * Hide action buttons associated with subtasks.
*/
function hideActionButtons() {
  const actionsDiv = document.querySelector(".subtask-actions");
  actionsDiv.classList.add("d-none");
}

/* ---------- Klara ---------- */

function addTaskfocusOnInputOrAddSubtask() {
  let input = document.getElementById('addTaskInputSubtasks');
  let search = input.value;
  if(search == '') {
    let addTaskInputSubtasksImg = document.getElementById('addTaskInputSubtasksImg');
    addTaskInputSubtasksImg.style.width = "40px";
    addTaskInputSubtasksImg.style.justifyContent = "space-between";
    addTaskInputSubtasksImg.style.paddingRight = "16px";
    addTaskInputSubtasksImg.innerHTML = '';
    addTaskInputSubtasksImg.innerHTML = /*html*/`<img onclick="addTaskChangeImageOnSubtaskInputToPlus()" class="width12" src="./img/boardClose.png" alt="close">
        <img onclick="addTaskEditTaskAddSubtask()" class="width14" src="./img/checkBlack.png" alt="check">
    `;
    focusOn('addTaskInputSubtasks');
  } else {
    addTaskEditTaskAddSubtask();
  }
}

function addTaskEditTaskAddSubtask() {
  let addTaskInputSubtasks = document.getElementById('addTaskInputSubtasks');
  if(addTaskInputSubtasks.value !== '') {
    addTasksSubtasks.push({
        subtask: addTaskInputSubtasks.value,
        done: false
    });
    addTaskInputSubtasks.value = '';
    // addTaskchangeImageOnSubtaskInputToPlus();
    renderAddTaskEditSubtasks();
  }
}

function renderAddTaskEditSubtasks() {
  let div = document.getElementById(`addTaskAllSubtasks`);
  div.innerHTML = '';
  for (let i = 0; i < addTasksSubtasks.length; i++) {
    let subtask = addTasksSubtasks[i];
    div.innerHTML += HTMLTemplateAddTaskEditSubtasks(i, subtask);
  }
}

function addTaskChangeImageOnSubtaskInputToPlus() {
  let addTaskInputSubtasks = document.getElementById('addTaskInputSubtasks');
  let addTaskInputSubtasksImg = document.getElementById('addTaskInputSubtasksImg');
  addTaskInputSubtasks.value = '';
  addTaskInputSubtasksImg.style.width = "48px";
  addTaskInputSubtasksImg.style.height = "48px";
  addTaskInputSubtasksImg.style.justifyContent = "center";
  addTaskInputSubtasksImg.style.paddingRight = "0";
  addTaskInputSubtasksImg.style.top = "0";
  addTaskInputSubtasksImg.style.right = "0";
  addTaskInputSubtasksImg.innerHTML = '';
  addTaskInputSubtasksImg.innerHTML = /*html*/`<img onclick="addTaskfocusOnInputOrAddSubtask()" class="height16" src="./img/add-2.png" alt="plus">`;
}

function addTaskEditTaskSubtask(i) {
  let addTaskSubtaskParent = document.getElementById(`addTaskSubtaskParent${i}`);
  addTaskSubtaskParent.classList.remove('hoverGrey');
  addTaskSubtaskParent.innerHTML = '';
  addTaskSubtaskParent.innerHTML = HTMLTemplateAddTaskEditSubtasksEdit(i);
  let addTaskEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
  addTaskEditSubtaskInput.focus();
}

function addTaskaddSubtaskOnEnter(event) {
  if(event.keyCode == 13) {
    event.preventDefault();
    addTaskEditTaskAddSubtask();
  }
}

/**
 * Adds blue border to a specific element.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
*/
function addTaskSetBlueBorderBottom(i) {
  let addTaskSubtaskParent = document.getElementById(`addTaskSubtaskParent${i}`);
  addTaskSubtaskParent.classList.add('blueBorderBottom');
}

/**
 * Removes the blue border from a specific element.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
*/
function addTaskRemoveBlueBorderBottom(i) {
  let addTaskSubtaskParent = document.getElementById(`addTaskSubtaskParent${i}`);
  addTaskSubtaskParent.classList.remove('blueBorderBottom');
}

function addTaskEditSubtaskInputValue(i) {

}

/**
 * Sets the value for a specific subtask.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
*/
function addTaskEditSubtaskInputValue(i) {
  let editEditSubtaskInput = document.getElementById(`editEditSubtaskInput${i}`);
  addTasksSubtasks[i].subtask = editEditSubtaskInput.value;
  renderAddTaskEditSubtasks();
}

/**
 * Deletes a specific subtask.
 * 
 * @param {number} i - Uses the index of a specific element as parameter.
 * @param {string} taskCreatedAt - Passes a unique long number to identify a specific task.
*/
function deleteAddTaskSubtask(i) {
  addTasksSubtasks.splice(i, 1);
  renderAddTaskEditSubtasks();
}

/**
 * Gets activated on resize of the document. It resizes the widht of an subtask-element.
 */
window.addEventListener('resize', widthSubtasks);

/**
 * Sets the right width for the subtask-element. It depends on the windows-width-size.
 */
function widthSubtasks() {
  if(youAreOnAddTaskSite()) {
    let addTaskAllSubtasks = document.getElementById('addTaskAllSubtasks');
    let addTaskInputSubtasksParent = document.getElementById('addTaskInputSubtasksParent');
    if(window.innerWidth <= 450) {
      addTaskAllSubtasks.style.width = "68%";
      addTaskInputSubtasksParent.style.width = "68%";
    } else if(window.innerWidth <= 1300) {
      addTaskAllSubtasks.style.width = "90%";
      addTaskInputSubtasksParent.style.width = "90%";
    } else {
      addTaskAllSubtasks.style.width = "100%";
      addTaskInputSubtasksParent.style.width = "100%";
    }
  }
}

/**
 * Checks if you are on the addTask-Site.
 * 
 * @returns {boolean} - Returns true if you are on the addTask-Site.
 */
function youAreOnAddTaskSite() {
  return window.location.href.includes("addTask");
}