let letters = [];

async function initContacts(){
    await loadContacts();
    fillLetters();
    loadLetters();
    renderContact();
}

function addNewContact(){
    document.getElementById('overlay-add-contact').classList.remove('d-none');
    document.getElementById('overlay-add-contact').classList.add('d-flex');
    document.getElementById('overlay-add-contact').classList.add('overlay-add-contact');
    document.getElementById('overlay-add-contact').innerHTML = createNewContactHTML();
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
    document.getElementById('right-side').classList.add('z-index');
    showOverlayCreated();
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

async function deleteEditContact(i){
    contacts.splice(i, 1);
    await saveContact();
    loadContacts();
    document.getElementById('show-contact-infos').innerHTML = '';
    closeEditContactWindow();
    initContacts();
    showOverlayDeleted();
}

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

function showContact(i){
    if (window.innerWidth < 1090){
        showContactMobile(i);
    } else {
        showContactDesktop(i);
    }
}

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

function backToList(){
    document.getElementById('right-side').classList.remove('z-index');
    document.getElementById('mobile-menu').classList.add('d-none');
    document.getElementById('blue-underline').classList.add('d-none');
}

function openMobileMenu(){
    document.getElementById('mobile-menu').classList.add('d-none');
    document.getElementById('edit-delete-mobile').classList.remove('d-none');
    document.getElementById('edit-delete-mobile').classList.add('edit-delete-mobile');
    document.getElementById('show-contact-infos').addEventListener("click", function(){
        document.getElementById('edit-delete-mobile').classList.add('d-none');
        document.getElementById('mobile-menu').classList.remove('d-none');
    }) 
}

function showOverlayContact() {
    setTimeout(() => {
      document.getElementById('show-contact-infos').classList.add('show-contact-infos');
    }, 225);
}

function showOverlayCreated() {
    document.getElementById('successfully-created').classList.add('show-successfully-created');
    setTimeout(() => {
      document.getElementById('successfully-created').classList.remove('show-successfully-created');
    }, 2000);
}

function showOverlayDeleted() {
    document.getElementById('successfully-deleted').classList.add('show-successfully-deleted');
    setTimeout(() => {
      document.getElementById('successfully-deleted').classList.remove('show-successfully-deleted');
    }, 2000);
}

function showOverlaySaved() {
    document.getElementById('successfully-saved').classList.add('show-successfully-saved');
    setTimeout(() => {
      document.getElementById('successfully-saved').classList.remove('show-successfully-saved');
    }, 2000);
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
    showOverlaySaved();
}

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

function loadLetters() {
    let container = document.getElementById('contact-area');
    container.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        const element = letters[i];
        container.innerHTML += createLetterHTML(element, i);
    };
}