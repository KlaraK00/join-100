const STORAGE_TOKEN = '';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let contactNames = [];
let contactMails = [];
let contactNumbers = [];

function addNewContact(){
    document.getElementById('overlay-add-contact').classList.remove('d-none');
    document.getElementById('overlay-add-contact').classList.add('d-flex');
    document.getElementById('overlay-add-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-add-contact').innerHTML = createNewContactHTML();
}

function editContact(){
    document.getElementById('overlay-edit-contact').classList.remove('d-none');
    document.getElementById('overlay-edit-contact').classList.add('d-flex');
    document.getElementById('overlay-edit-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-edit-contact').innerHTML = createEditContactHTML();
}

function closeNewContactWindow(){
    document.getElementById('overlay-add-contact').classList.add('d-none');
    document.getElementById('overlay-add-contact').classList.remove('d-flex');
    document.getElementById('overlay-add-contact').classList.remove('overlay-add-contact');
}

function closeEditContactWindow(){
    document.getElementById('overlay-edit-contact').classList.add('d-none');
    document.getElementById('overlay-edit-contact').classList.remove('d-flex');
    document.getElementById('overlay-edit-contact').classList.remove('overlay-add-contact');
}

function createContact(){
    let contactName = document.getElementById('contactName');
    let contactMail = document.getElementById('contactMail');
    let contactNumber = document.getElementById('contactNumber');
    contactNames.push(contactName.value);
    contactMails.push(contactMail.value);
    contactNumbers.push(contactNumber.value);
    renderContact();
    closeNewContactWindow();
}

function renderContact(){
    document.getElementById('informations').innerHTML = '';
    for (let i = 0; i < contactNames.length; i++) {
        document.getElementById('informations').innerHTML += createContactHTML(i);
    }
}

function createContactHTML(i){
    return `
    <div class="informations" id="contact-infos${i}">
        <div class="user-small">AS</div>
            <div>
            ${contactNames[i]} <br>
            <a href="">${contactMails[i]}</a>
        </div>
    </div>
    `;
}

function createNewContactHTML() {
    return `
    <div class="overlay-contact">
        <div class="close-button">
            <img onclick="closeNewContactWindow()" src="./img/Close.png">
        </div>
        <div class="blue-container">
            <img src="./img/popup-join-logo.png">
            <h1>Add contact</h1>
            <h2>Taks are better with a team!</h2>
            <img src="./img/blue-underline.png">
        </div>
        <div class="profile-logo">
            <img src="./img/profile-logo.png">
        </div>
        <div class="input-new-contact">
            <form>
                <div class="input-fields">
                    <input id="contactName" class="input background-img-profile" placeholder="Name" required>
                    <input id="contactMail" class="input background-img-mail" placeholder="Email" required>
                    <input id="contactNumber" class="input background-img-phone" placeholder="Phone" required>
                </div>
                <div class="add-contact-button">
                    <button type="button" onclick="closeNewContactWindow()" class="button2">Cancel</button>
                    <button onclick="createContact()" type="button" class="button3">Create contact</button>
                </div>
            </form>
    </div>
    `;
}

function createEditContactHTML() {
    return `
    <div class="overlay-contact">
        <div class="close-button">
            <img onclick="closeEditContactWindow()" src="./img/Close.png">
        </div>
        <div class="blue-container">
            <img src="./img/popup-join-logo.png">
            <h1>Edit contact</h1>
            <img src="./img/blue-underline.png">
        </div>
        <div class="profile-logo">
            <img src="./img/profile-logo.png">
        </div>
        <div class="input-new-contact">
            <form>
                <div class="input-fields">
                    <input class="input background-img-profile" placeholder="Name" required>
                    <input class="input background-img-mail" placeholder="Email" required>
                    <input class="input background-img-phone" placeholder="Phone" required>
                </div>
                <div class="add-contact-button">
                    <button class="button4">Delete</button>
                    <button class="button5">Save</button>
                </div>
            </form>
    </div>
    `;
}