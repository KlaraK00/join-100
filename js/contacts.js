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
    renderContact();
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
    let name = document.getElementById('contactName');
    let mail = document.getElementById('contactMail');
    let number = document.getElementById('contactNumber');
    let createdAt = new Date().getTime();
    let contactInfo = {
        "name" : name.value,
        "mail" : mail.value,
        "number" : number.value,
        "id" : createdAt,
    }
    contacts.push(contactInfo);
    await saveContact();
    renderContact();
    closeNewContactWindow();
}

function renderContact(){
    document.getElementById('informations').innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        document.getElementById('informations').innerHTML += createContactHTML(i);
    }
}

async function deleteContact(i){
    contacts.splice(i, 1);
    saveContact();
    loadContacts2();
    document.getElementById('show-contact-infos').innerHTML = '';
}

function showContact(i){
    document.getElementById('show-contact-infos').innerHTML = '';
    document.getElementById('show-contact-infos').innerHTML += createShowContactHTML(i);
}

function createContactHTML(i){
    return `
    <div onclick="showContact(${i})" class="informations" id="contact-infos${i}">
        <div class="user-small">AM</div>
            <div>
            ${contacts[i]['name']} <br>
            <a href="">${contacts[i]['mail']}</a>
        </div>
    </div>
    `;
}

function createShowContactHTML(i){
    return`
    <div class="contact-info">
        <div class="user">AM</div> 
        <div class="name-logos">
        <h3>${contacts[i]['name']}</h3>
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
                    <input class="input background-img-profile" placeholder="Name">
                    <input class="input background-img-mail" placeholder="Email">
                    <input class="input background-img-phone" placeholder="Phone">
                </div>
                <div class="add-contact-button">
                    <button onclick="deleteContact(${i})" class="button4">Delete</button>
                    <button class="button5">Save</button>
                </div>
            </form>
    </div>
    `;
}