/**
 * Creates a checkbox image for a contact element.
 * @param {Object} contact - The contact object to determine if it is selected.
 * @returns {HTMLElement} - The checkbox image element.
*/
function createCheckboxImage(contact) {
  const checkboxImg = document.createElement("img");
  checkboxImg.setAttribute(
    "src",
    selectedContacts.includes(contact.createdAt)
      ? "img/checkedCheckboxWhite.png"
      : "img/checkboxNotChecked.png"
    );
    checkboxImg.className = "contact-checkbox";
    return checkboxImg;
}
  
/**
  * Attaches an event listener to a contact element for selection handling.
  * @param {HTMLElement} contactElement - The contact element to attach the listener to.
  * @param {Object} contact - The contact object related to the element.
*/
function attachEventListenerToContactElement(contactElement, contact) {
  contactElement.onclick = function () {
    const index = selectedContacts.indexOf(contact.createdAt);
    if (index > -1) {
      selectedContacts.splice(index, 1);
      contactElement.classList.add("d-none");
      contactElement
        .querySelector(".contact-checkbox")
        .setAttribute("src", "img/checkboxNotChecked.png");
      contactElement.classList.remove("selected");
    } else {
      selectedContacts.push(contact.createdAt);
      contactElement
        .querySelector(".contact-checkbox")
        .setAttribute("src", "img/checkedCheckboxWhite.png");
      contactElement.classList.add("selected");
      contactElement.classList.remove("d-none");
    }
    updateAssignContactInput();
  };
}
  
/**
  * Updates the contacts dropdown with the provided contacts.
  * @param {Array} contacts - The array of contact objects to display in the dropdown.
*/
function updateContactsDropdown(contacts) {
    const contactsDropdown = document.getElementById("contactsDropdown");
    if (contactsDropdown) {
      contactsDropdown.innerHTML = "";
    }
  
    contacts.forEach((contact) => {
      const contactElement = createContactElement(contact);
      attachEventListenerToContactElement(contactElement, contact);
      if (selectedContacts.includes(contact.createdAt)) {
        contactElement.classList.add("selected");
      }
      contactsDropdown.appendChild(contactElement);
    });
}

/**
  * Clears the content of the selected contacts container.
*/
function clearSelectedContactsContainer() {
  const selectedContactsContainer = document.getElementById(
    "selectedContactsContainer"
  );
  selectedContactsContainer.innerHTML = "";
}
  
/**
  * Creates and returns a div element displaying the contact's initials with a background color.
  * @param {Object} contact - The contact object.
  * @returns {HTMLElement} A div element displaying the contact's initials.
*/
function createContactDisplayElement(contact) {
  const initialsDiv = document.createElement("div");
  initialsDiv.className = "contact-initials";
  initialsDiv.textContent = contact.initials;
  initialsDiv.style.backgroundColor = contact.color; // Use the contact's specified color
  return initialsDiv;
}
  
/**
  * Updates the display of selected contacts in the container.
  * Each selected contact's initials are displayed with their specific color.
*/
function updateAssignContactInput() {
  clearSelectedContactsContainer(); // First, clear the container
  
  const selectedContactsContainer = document.getElementById(
    "selectedContactsContainer"
  );
  
  // Iterate through each selected contact and add its display element to the container
  selectedContacts.forEach((contactId) => {
    const contact = contacts.find((c) => c.createdAt === contactId);
    if (contact) {
      const contactDisplayElement = createContactDisplayElement(contact);
      selectedContactsContainer.appendChild(contactDisplayElement);
    }
  });
}
  
let selectedCategory = "";
/**
  * Populates the category dropdown with predefined categories and sets up event listeners for each option.
  * Upon selecting a category, it updates the visible input field with the chosen category and closes the dropdown.
*/
function updateCategoryDropdown() {
  // Get the dropdown element from the DOM.
  const categoryDropdown = document.getElementById("categoryDropdown");
  // Clear existing options.
  categoryDropdown.innerHTML = "";
  
  // Predefined categories to be displayed in the dropdown.
  const categories = ["Technical Task", "User Story"];
  
  // Create and append a div element for each category.
  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category-option");
    categoryElement.textContent = category;
  
    // Set up click event listener for each category option.
    categoryElement.onclick = function () {
      // Update the globally selected category variable.
      selectedCategory = category;
      // Update the visible input field with the selected category.
      document.querySelector(".category-input").value = category;
      // Close the dropdown after selection.
      toggleCategoryDropdown();
    };
  
    // Append the newly created category option to the dropdown.
    categoryDropdown.appendChild(categoryElement);
  });
}
  
/**
  * Toggles the visibility of the category dropdown and rotates the arrow icon accordingly.
  * When the dropdown is opened, the arrow icon is rotated 180 degrees to indicate the open state.
  * When closed, the arrow is returned to its original position.
*/
function toggleCategoryDropdown() {
  // Reference to the dropdown and arrow icon elements.
  const dropdown = document.getElementById("categoryDropdown");
  const arrowImage = document.getElementById("arrow2");
  
  // Check the current display state of the dropdown.
  if (dropdown.style.display === "none" || !dropdown.style.display) {
    // If hidden, show the dropdown and rotate the arrow icon.
    dropdown.style.display = "block";
    arrowImage.classList.add("rotate-180");
  } else {
    // If shown, hide the dropdown and revert the arrow icon rotation.
    dropdown.style.display = "none";
    arrowImage.classList.remove("rotate-180");
  }
}
  
/**
  * Initializes contact-related event listeners including input filtering, focus, and dropdown toggling.
*/
function attachContactEventListeners() {
  const assignContactInput = document.querySelector(".assignContact");
  const dropdown = document.getElementById("contactsDropdown");
  // Existing event listeners
  assignContactInput.addEventListener("focus", toggleContactsDropdown);
  
  assignContactInput.addEventListener("input", filterContactOptions);
  
  document
    .querySelector(".contactInput img")
    .addEventListener(
      "click",
      stopPropagationAndToggle.bind(null, toggleContactsDropdown)
    );
  
  // New event listener for closing the dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !dropdown.contains(event.target) &&
      !assignContactInput.contains(event.target) &&
      !event.target.matches(".contactInput img")
    ) {
      toggleDropdownOpen(dropdown, false); // Ensure the dropdown is closed
    }
  });
}
  
function toggleDropdownOpen(dropdown, open = null) {
  const arrowId = "arrow";
  // If 'open' is explicitly set, use it to show/hide the dropdown
  if (open !== null) {
    dropdown.classList.toggle("show", open);
    rotateArrow(arrowId, dropdown.classList.contains("show"));
  } else {
    // Otherwise, just toggle the current state
    dropdown.classList.toggle("show");
  }
}
  
/**
  * Filters contact options based on the input value.
  * @param {Event} event - The input event triggering the filter.
*/
function filterContactOptions(event) {
  const searchTerm = event.target.value.toLowerCase();
  document.querySelectorAll(".contact-option").forEach((option) => {
    const contactId = option.getAttribute("data-contact-id");
    const contact = contacts.find((c) => c.createdAt.toString() === contactId);
    option.classList.toggle(
      "d-none",
      !(
        contact &&
        (contact.firstName.toLowerCase().includes(searchTerm) ||
        contact.lastName.toLowerCase().includes(searchTerm))
      )
    );
  });
  toggleDropdownOpen(document.getElementById("contactsDropdown"));
}
  
/**
  * Initializes category selection related event listeners.
  */
function attachCategoryEventListeners() {
  document
    .querySelector(".categoryInput img")
    .addEventListener(
      "click",
      stopPropagationAndToggle.bind(null, toggleCategoryDropdown)
    );
}
  
/**
  * Initializes subtask addition event listeners for both click and keypress events.
  */
function attachSubtaskEventListeners() {
  let plus = document.getElementById("plus");
  if(plus) {
    plus.addEventListener("click", handleAddSubtaskClick);
  }
  let subtasks = document.getElementById("subtasks");
  if(subtasks) {
    subtasks.addEventListener("keypress", handleAddSubtaskKeypress);
  }
}
  
/**
  * Initializes date input related event listeners for validation and auto-formatting.
  */
function attachDateEventListeners() {
  document.getElementById("due").addEventListener("blur", autoFormatDate);
}
  
/**
  * Toggles the display of a dropdown based on focus.
  * @param {HTMLElement} dropdown - The dropdown element to toggle.
  */
function toggleDropdownFocus(dropdown) {
  if (!dropdown.classList.contains("show")) dropdown.classList.add("show");
}
  
/**
  * Stops event propagation and executes a given toggle function.
  * @param {Function} toggleFunction - The function to execute for toggling.
  * @param {Event} event - The triggering event.
*/
function stopPropagationAndToggle(toggleFunction, event) {
  event.stopPropagation();
  toggleFunction();
}
  
/**
  * Handles the click event for adding a subtask.
  * @param {Event} event - The triggering event.
*/
function handleAddSubtaskClick(event) {
  event.stopPropagation();
  handleAddSubtask();
}
  
/**
  * Handles the keypress event for adding a subtask, specifically on Enter key press.
  * @param {Event} event - The triggering event.
*/
function handleAddSubtaskKeypress(event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
    handleAddSubtask();
  }
}
  
/**
  * Automatically formats the date input field value upon losing focus and validates it.
*/
function autoFormatDate(event) {
  // Auto-formatting logic as before
  let value = event.target.value.replace(/[\.\-\/]/g, "");
  
  if (value.length > 2 && value.length <= 4)
    value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 4)
    value =
      value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
  
  event.target.value = value;
  
  // Trigger validation after formatting
  isValidDateInput(event);
}
  
function initializeEventListeners() {
  attachContactEventListeners();
  attachCategoryEventListeners();
  attachSubtaskEventListeners();
  attachDateEventListeners();
}