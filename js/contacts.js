let letters = [];

async function initContacts(){
    await loadContacts2();
    fillLetter();
    loadLetters();
    renderContact();
}

function addNewContact(){
    document.getElementById('overlay-add-contact').classList.remove('d-none');
    document.getElementById('overlay-add-contact').classList.add('d-flex');
    document.getElementById('overlay-add-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-add-contact').innerHTML = createNewContactHTML();
}

async function loadContacts2() {
    if(await contactsExist()) {
        contacts = JSON.parse(await getItem('contacts'));
    }
}

function editContact(i){
    document.getElementById('overlay-edit-contact').classList.remove('d-none');
    document.getElementById('overlay-edit-contact').classList.add('d-flex');
    document.getElementById('overlay-edit-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-edit-contact').innerHTML = createEditContactHTML(i);
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
}

function getFirstName1() {
    let name = document.getElementById('contactName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

function getLastName1() {
    let name = document.getElementById('contactName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

function getFirstName2() {
    let name = document.getElementById('editName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

function getLastName2() {
    let name = document.getElementById('editName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

function showInitials(){
    let firstName = getFirstName1();
    let lastName = getLastName1();
    let initials = firstName.charAt(0) + lastName.charAt(0);
    document.getElementById('initials').innerHTML = initials;
}

function renderContact(){
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i]['firstName'];
        let firstLetterName = contact.charAt(0);
        document.getElementById(firstLetterName).innerHTML += createContactHTML(contact, firstLetterName, i);
    }
}

async function deleteContact(i){
    contacts.splice(i, 1);
    saveContact();
    loadContacts2();
    document.getElementById('show-contact-infos').innerHTML = '';
    initContacts();
}

function showContact(i){
    document.getElementById('show-contact-infos').innerHTML = '';
    document.getElementById('show-contact-infos').innerHTML += createShowContactHTML(i);
}

async function editAContact(i){
    contacts.splice(i, 1);
    let mail = document.getElementById('editMail');
    let number = document.getElementById('editNumber');
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
}

function fillLetter() {
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

function loadLetters() {
    let container = document.getElementById('contact-area');
    container.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        const element = letters[i];
        container.innerHTML += createLetterHTML(element, i);
    };
}

function createLetterHTML(letter, i){
    return `
        <div class="letter">${letter}</div>
        <div class="line-contacts"></div>
        <div id="${letter}" class="show-contact">
    `;
}

function createContactHTML(contact, firstLetterName, i){
    return `
    <div onclick="showContact(${i})" class="informations" id='contact-info${i}'>
        <div class="user-small" style="background-color: ${contacts[i]['color']}">${contacts[i]['initials']}</div>
            <div>
            ${contacts[i]['firstName']} ${contacts[i]['lastName']} <br>
            <a href="">${contacts[i]['mail']}</a>
        </div>
    </div>
    `;
}

function createShowContactHTML(i){
    return`
    <div class="contact-info">
        <div class="user" style="background-color: ${contacts[i]['color']}">${contacts[i]['initials']}</div> 
        <div class="name-logos">
        <h3>${contacts[i]['firstName']} ${contacts[i]['lastName']}</h3>
        <div class="logos">
        <div onclick="editContact(${i})" class="edit"><img src="./img/edit-black.png">Edit</div>
        <div onclick="deleteContact(${i})" class="delete"><img src="./img/delete.png">Delete</div>
        </div>
    </div>
    </div>
    <h4>Contact Information</h4>
    <h5>Email</h5>
    <a href=""><a href="">${contacts[i]['mail']}</a>
    <h5>Phone</h5>
    ${contacts[i]['number']}
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
                    <button onclick="createAContact()" type="button" class="button3">Create contact</button>
                </div>
            </form>
    </div>
    `;
}

function createEditContactHTML(i) {
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
                    <input id="editName" class="input background-img-profile" value="${contacts[i]['firstName']} ${contacts[i]['lastName']}">
                    <input id="editMail" class="input background-img-mail" value="${contacts[i]['mail']}">
                    <input id="editNumber" class="input background-img-phone" value="${contacts[i]['number']}">
                </div>
                <div class="add-contact-button">
                    <button onclick="deleteContact(${i})" class="button4">Delete</button>
                    <button onclick="editAContact(${i})" class="button5">Save</button>
                </div>
            </form>
    </div>
    `;
}