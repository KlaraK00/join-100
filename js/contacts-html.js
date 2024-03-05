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
                    <button onclick="deleteEditContact(${i})" type="button" class="button4">Delete</button>
                    <button onclick="editAContact(${i})" type="button" class="button5">Save</button>
                </div>
            </form>
    </div>
    `;
}