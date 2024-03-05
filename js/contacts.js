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
    await saveContact();
    loadContacts2();
    document.getElementById('show-contact-infos').innerHTML = '';
    initContacts();
}

async function deleteEditContact(i){
    contacts.splice(i, 1);
    await saveContact();
    loadContacts2();
    closeEditContactWindow();
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