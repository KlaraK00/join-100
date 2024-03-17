let letters = [];

/**
 * Initializes the contacts, loads them, and renders them if the user is logged in.
 * Otherwise, displays an error.
 */
async function initContacts(){
    loadLoggedIn();
    if(loggedIn) {
        await includeHTML();
        await loadContacts();
        highlightActiveSideButton();
        currentUser = getCurrentUser();
        showUserNavBar();
        fillLetters();
        loadLetters();
        renderContact();
    } else {
        showLogInError();
    }
}

/**
 * Opens the overlay to add a new contact.
 */
function addNewContact(){
    document.getElementById('overlay-add-contact').classList.remove('d-none');
    document.getElementById('overlay-add-contact').classList.add('d-flex');
    document.getElementById('overlay-add-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-add-contact').innerHTML = createNewContactHTML();
}

/**
 * Closes the overlay for adding a new contact when clicking on the background behind the overlay.
 * @param {Event} event - The click event that was triggered.
 */
function closeOverlayNewContact(event) {
    var overlay = document.getElementById('overlay-add-contact');
    if (event.target === overlay) {
        overlay.classList.add('d-none');
        overlay.classList.remove('d-flex');
    }
}

/**
 * Closes the overlay for editing a contact when clicking on the background behind the overlay.
 * @param {Event} event - The click event that was triggered.
 */
function closeOverlayEditContact(event) {
    var overlay = document.getElementById('overlay-edit-contact');
    if (event.target === overlay) {
        overlay.classList.add('d-none');
        overlay.classList.remove('d-flex');
    }
}

document.addEventListener('click', closeOverlayNewContact);
document.addEventListener('click', closeOverlayEditContact);

/**
 * Opens the overlay to edit an existing contact.
 * @param {number} i - The index of the contact to edit.
 */
function editContact(i){
    document.getElementById('overlay-edit-contact').classList.remove('d-none');
    document.getElementById('overlay-edit-contact').classList.add('d-flex');
    document.getElementById('overlay-edit-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-edit-contact').innerHTML = createEditContactHTML(i);
}

/**
 * Closes the overlay for adding a new contact.
 */
function closeNewContactWindow(){
    document.getElementById('overlay-add-contact').classList.add('d-none');
    document.getElementById('overlay-add-contact').classList.remove('d-flex');
    document.getElementById('overlay-add-contact').classList.remove('overlay-add-contact');
}

/**
 * Closes the overlay for editing an existing contact.
 */
function closeEditContactWindow(){
    document.getElementById('overlay-edit-contact').classList.add('d-none');
    document.getElementById('overlay-edit-contact').classList.remove('d-flex');
    document.getElementById('overlay-edit-contact').classList.remove('overlay-add-contact');
}

/**
 * Creates a new contact based on the entered information.
 * Saves the contact and then updates the display.
 */
 async function createAContact(){
    let mail = document.getElementById('contactMail');
    let number = document.getElementById('contactNumber');
    let createdAt = new Date().getTime();
    let firstName = getFirstName1();
    let lastName = getLastName1();
    let contactInfo = {
        "firstName" : firstName,
        "lastName" : lastName,
        "initials" : firstName.charAt(0) + lastName.charAt(0),
        "mail" : mail.value,
        "number" : number.value,
        "createdAt" : createdAt,
        "color": selectColor(),
    }
    contacts.push(contactInfo);
    await saveContact();
    closeNewContactWindow();
    initContacts();
    document.getElementById('right-side').classList.add('z-index');
    showOverlayCreated();
}

/**
 * Extracts the first name from the contact input field.
 * @returns {string} The first name of the contact.
 */
function getFirstName1() {
    let name = document.getElementById('contactName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

/**
 * Extracts the last name from the contact input field.
 * @returns {string} The last name of the contact.
 */
function getLastName1() {
    let name = document.getElementById('contactName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

/**
 * Extracts the first name from the edit contact input field.
 * @returns {string} The first name of the contact.
 */
function getFirstName2() {
    let name = document.getElementById('editName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

/**
 * Extracts the last name from the edit contact input field.
 * @returns {string} The last name of the contact.
 */
function getLastName2() {
    let name = document.getElementById('editName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

/**
 * Displays the initials of the current contact.
 */
function showInitials(){
    let firstName = getFirstName1();
    let lastName = getLastName1();
    let initials = firstName.charAt(0) + lastName.charAt(0);
    document.getElementById('initials').innerHTML = initials;
}

/**
 * Renders the contacts on the user interface.
 */
function renderContact(){
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i]['firstName'];
        let firstLetterName = contact.charAt(0);
        document.getElementById(firstLetterName).innerHTML += createContactHTML(contact, firstLetterName, i);
    }
}

/**
 * Deletes a contact based on its index.
 * @param {number} i - The index of the contact to delete.
 */
async function deleteContact(i){
    document.getElementById(`contact-info${i}`).remove();
    if (previousContact === i) {
        previousContact = null;
    }
    contacts.splice(i, 1);
    await saveContact();
    loadContacts();
    document.getElementById('show-contact-infos').innerHTML = '';
    initContacts();
    showOverlayDeleted();
}

/**
 * Deletes an edited contact based on its index.
 * @param {number} i - The index of the contact to delete.
 */
async function deleteEditContact(i){
    contacts.splice(i, 1);
    await saveContact();
    loadContacts();
    document.getElementById('show-contact-infos').innerHTML = '';
    closeEditContactWindow();
    initContacts();
    showOverlayDeleted();
}

/**
 * Displays the details of a contact on desktop.
 * @param {number} i - The index of the contact to display.
 */
function showContactDesktop(i){
    document.getElementById('show-contact-infos').innerHTML = '';
    document.getElementById('show-contact-infos').innerHTML += createShowContactHTML(i);
    document.getElementById('show-contact-infos').classList.add('hide-contact-infos');
    document.getElementById('show-contact-infos').classList.remove('show-contact-infos');
    showOverlayContact();
    if (previousContact !== null) {
        document.getElementById(`contact-info${previousContact}`).style.backgroundColor = 'white';
        document.getElementById(`contact-info${previousContact}`).style.color = 'black';
    }
    document.getElementById(`contact-info${i}`).style.backgroundColor = 'rgb(42,54,71)';
    document.getElementById(`contact-info${i}`).style.color = 'white';
    previousContact = i
}

/**
 * Decides whether to display the details of a contact on a mobile device or desktop.
 * @param {number} i - The index of the contact to display.
 */
function showContact(i){
    if (window.innerWidth < 1090){
        showContactMobile(i);
    } else {
        showContactDesktop(i);
    }
}

/**
 * Displays the details of a contact on mobile devices.
 * @param {number} i - The index of the contact to display.
 */
function showContactMobile(i){
    document.getElementById('show-contact-infos').innerHTML = '';
    document.getElementById('show-contact-infos').innerHTML += createShowContactHTML(i);
    document.getElementById('right-side').classList.add('z-index');
    document.getElementById('show-contact-infos').classList.remove('hide-contact-infos');
    document.getElementById('mobile-menu').classList.remove('d-none');
    if (previousContact !== null) {
        document.getElementById(`contact-info${previousContact}`).style.backgroundColor = 'white';
        document.getElementById(`contact-info${previousContact}`).style.color = 'black';
    }
    document.getElementById(`contact-info${i}`).style.backgroundColor = 'rgb(42,54,71)';
    document.getElementById(`contact-info${i}`).style.color = 'white';
    previousContact = i;
}

/**
 * Switches to the contact list view.
 */
function backToList(){
    document.getElementById('right-side').classList.remove('z-index');
    document.getElementById('mobile-menu').classList.add('d-none');
    document.getElementById('blue-underline').classList.add('d-none');
}

/**
 * Opens the mobile menu for contacts.
 */
function openMobileMenu(){
    document.getElementById('mobile-menu').classList.add('d-none');
    document.getElementById('edit-delete-mobile').classList.remove('d-none');
    document.getElementById('edit-delete-mobile').classList.add('edit-delete-mobile');
    document.getElementById('show-contact-infos').addEventListener("click", function(){
        document.getElementById('edit-delete-mobile').classList.add('d-none');
        document.getElementById('mobile-menu').classList.remove('d-none');
    }) 
}

/**
 * Displays the overlay for contact information.
 */
function showOverlayContact() {
    setTimeout(() => {
      document.getElementById('show-contact-infos').classList.add('show-contact-infos');
    }, 225);
}

/**
 * Displays the overlay for successful contact creation.
 */
function showOverlayCreated() {
    document.getElementById('successfully-created').classList.add('show-successfully-created');
    setTimeout(() => {
      document.getElementById('successfully-created').classList.remove('show-successfully-created');
    }, 2000);
}

/**
 * Displays the overlay for successful contact deletion.
 */
function showOverlayDeleted() {
    document.getElementById('successfully-deleted').classList.add('show-successfully-deleted');
    setTimeout(() => {
      document.getElementById('successfully-deleted').classList.remove('show-successfully-deleted');
    }, 2000);
}

/**
 * Displays the overlay for successful contact saving.
 */
function showOverlaySaved() {
    document.getElementById('successfully-saved').classList.add('show-successfully-saved');
    setTimeout(() => {
      document.getElementById('successfully-saved').classList.remove('show-successfully-saved');
    }, 2000);
}

/**
 * Edits an existing contact.
 * @param {number} i - The index of the contact to edit.
 */
async function editAContact(i){
    contacts.splice(i, 1);
    let mail = document.getElementById('editMail');
    let number = document.getElementById('editNumber');
    let createdAt = new Date().getTime();
    let firstName = getFirstName2();
    let lastName = getLastName2();
    let contactInfo = {
        "firstName" : firstName,
        "lastName" : lastName,
        "initials" : firstName.charAt(0) + lastName.charAt(0),
        "mail" : mail.value,
        "number" : number.value,
        "createdAt" : createdAt,
        "color": selectColor(),
    }
    contacts.push(contactInfo);
    await saveContact();
    closeEditContactWindow();
    document.getElementById('show-contact-infos').innerHTML = '';
    initContacts();
    showOverlaySaved();
}

/**
 * Fills the 'letters' array with the initial letters of the contacts.
 */
function fillLetters() {
    letters = [];
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['firstName'];
        let letter = name.charAt(0);
        if (!letters.includes(letter)) {
            letters.push(letter);
        }
    }
    letters.sort();
}

/**
 * Loads the initial letters of the contacts into the user interface.
 */
function loadLetters() {
    let container = document.getElementById('contact-area');
    container.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        const element = letters[i];
        container.innerHTML += createLetterHTML(element, i);
    };
}