/**
 * This function is used to prevent a reload of the formular and check the passwords to sign up an user.
 * 
 * @param {Event} event - The event object representing the registration event.
 */
function register(event) {
    noReload(event);
    checkPassword();
}

/**
 * Prevents the default mode associated with an event.
 * 
 * @param {Event} event - The event object representing the event for which the default mode should be prevented.
 */
function noReload(event) {
    event.preventDefault();
}

/**
 * Checks the passwords. If they are the same you sign up successfully. If not it informs about the misfit.
 */
function checkPassword() {
    let firstPassword = document.getElementById('registerFirstPassword').value;
    let secondPassoword = document.getElementById('registerSecondPassword').value;
    if(firstPassword == secondPassoword) {
        signUpSuccessfully();
    } else {
        showNoPasswordMatch();
    }
}

/**
 * Creates an unique variable under which it creates an user and a contact. After that it informs about the successfull sign up.
 */
async function signUpSuccessfully() {
    let createdAt = new Date().getTime();
    await createUser(createdAt);
    await createContact(createdAt);
    informsAboutSuccessfullSignUp();
}

/**
 * Creates a new user.
 * It adds the user to the array of users and after that it stores the whole users-array in the remote storage.
 * 
 * @param {number} createdAt - "CreatedAt" is a unique variable. Every user has it's own unique "createdAt"-number.
 */
async function createUser(createdAt) {
    addUser(createdAt);
    await saveUsers();
}

/**
 * Creates an user-object which is added to the array "users".
 * 
 * @param {number} createdAt - "CreatedAt" is a unique variable. Every user has it's own unique "createdAt"-number.
 */
function addUser(createdAt) {
    let firstName = getFirstName();
    let lastName = getLastName();
    let email = document.getElementById('registerEmail').value;
    let password = document.getElementById('registerFirstPassword').value;
    let user = {
        createdAt: createdAt,
        firstName: firstName,
        lastName: lastName,
        initials: firstName.charAt(0) + lastName.charAt(0),
        email: email,
        password: password,
    }
    users.push(user);
}

/**
 * Divides the whole name in two and secures the first part. That's the first name.
 * 
 * @returns {string} - Returns the first name.
 */
function getFirstName() {
    let name = document.getElementById('registerName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

/**
 * Divides the whole name in two and secures the second part. That's the last name.
 * 
 * @returns {string} - Returns the last name.
 */
function getLastName() {
    let name = document.getElementById('registerName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

/**
 * Stores an item in the browser's remote storage under the key "users" which has the value of the array "users". 
 */
async function saveUsers() {
    await setItem('users', users);
}

/**
 * Creates a new contact.
 * It adds the contact to the array of contacts and after that it stores the whole contacts-array in the remote storage.
 * 
 * @param {number} createdAt - "CreatedAt" is a unique variable. Every contact has it's own unique "createdAt"-number.
 */
async function createContact(createdAt) {
    addContact(createdAt);
    await saveContact();
}

/**
 * Creates an contact-object which is added to the array "contacts".
 * 
 * @param {number} createdAt - "CreatedAt" is a unique variable. Every contact has it's own unique "createdAt"-number.
 */
function addContact(createdAt) {
    let firstName = getFirstName();
    let lastName = getLastName();
    let email = document.getElementById('registerEmail').value;
    let contact = {
        firstName: firstName,
        lastName: lastName,
        initials: firstName.charAt(0) + lastName.charAt(0),
        mail: email,
        number: '',
        createdAt: createdAt,
        color: selectColor()
    }
    contacts.push(contact);
}

/**
 * Choses a color from the colors-array. 
 * Every time this function is executed a random number between -1 and 15 is generated.
 * This number represents the index for the specific color.
 * 
 * @returns {string} - Returns a rgba-color-code in s string.
 */
function selectColor() {
    let randomNumber = Math.round(Math.random() * 14);
    return colors[randomNumber];
}

/**
 * Stores an item in the browser's remote storage under the key "contacts" which has the value of the array "contacts". 
 */
async function saveContact() {
    await setItem('contacts', contacts);
}

/**
 * Shows the whole process of presenting the notification of sign up.
 */
function informsAboutSuccessfullSignUp() {
    showInformationSignedUpSuccessfully();
    setTimeout(() => {
        hideInformationSignedUpSuccessfully()
        redirectToLogIn();
    }, 2000);
}

/**
 * Activates the animation "bottomSlideInAndOut" for the notification of sign in because the whole div with the id "registerSignUpSuccessfully" appears.
 */
function showInformationSignedUpSuccessfully() {
    let registerSignUpSuccessfully = document.getElementById('registerSignUpSuccessfully');
    registerSignUpSuccessfully.classList.remove('d-none');
}

/**
 * Hides the whole div with the id "registerSignUpSuccessfully".
 */
function hideInformationSignedUpSuccessfully() {
    let registerSignUpSuccessfully = document.getElementById('registerSignUpSuccessfully');
    registerSignUpSuccessfully.classList.add('d-none');
}

/**
 * Redirects to log-in-page.
 */
function redirectToLogIn() {
    window.location.href = "./index.html";
}

/**
 * Shows that the passwords don't match while adding a red border and presenting a div with some more words about it.
 */
function showNoPasswordMatch() {
    addRedBorder('registerSecondPassword');
    addDiv('informNotTheSamePassword');
}

/**
 * Adds a red border to an element with a specific id.
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function addRedBorder(id) {
    let element = document.getElementById(id);
    element.classList.add('redBorder');
}

/**
 * Displays a div with a specific id parameter.
 * 
 * @param {string} id - Uses an id as parameter.
 */
function addDiv(id) {
    let element = document.getElementById(id);
    element.classList.remove('d-none');
}
