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

/* ---------- PASSWORD-VISIBILITY ---------- */

/**
 * Shows an eye or a lock as image on a specific input.
 * 
 * @param {string} input - Uses an id of an input as parameter.
 * @param {string} lock - Passes an id of an image.
 * @param {string} eye - Passes an id of an image.
 */
function showEyeOrLock(input, lock, eye) {
    if(passwordIsEmpty(input)) {
        showLock(lock, eye);
    } else {
        showEye(eye, lock);
    }
}

/**
 * Tests if the value of the input is empty.
 * 
 * @param {string} input - Passes an id of an input.
 * @returns {boolean} - Returns true if the password-value is nothing.
 */
function passwordIsEmpty(input) {
    let password = document.getElementById(input).value;
    return password == '';
}

/**
 * Shows the lock image.
 * 
 * @param {string} lock - Passes an id of an image.
 * @param {string} eye - Passes an id of an image.
 */
function showLock(lock, eye) {
    appearLock(lock);
    disappearEye(eye);
}

/**
 * Shows the lock image by removing the css-property "display: none;".
 * 
 * @param {string} lock - Passes an id of an image.
 */
function appearLock(lock) {
    let lockImg = document.getElementById(lock);
    lockImg.classList.remove('d-none');
}

/**
 * Hides the eye image.
 * 
 * @param {string} eye - Passes an id of an image.
 */
function disappearEye(eye) {
    let eyeImg = document.getElementById(eye);
    eyeImg.classList.add('d-none');
}

/**
 * Shows the eye image.
 * 
 * @param {string} lock - Passes an id of an image.
 * @param {string} eye - Passes an id of an image.
 */
function showEye(eye, lock) {
    disappearLock(lock);
    appearLogInEye(eye);
}

/**
 * Hides the lock image by adding to it the css-property "display: none;".
 * 
 * @param {string} lock - Passes an id of an image.
 */
function disappearLock(lock) {
    let lockImg = document.getElementById(lock);
    lockImg.classList.add('d-none');
}

/**
 * Shows the eye image through removing the css-property "display: none;".
 * 
 * @param {string} eye - Passes an id of an image.
 */
function appearLogInEye(eye) {
    let eyeImg = document.getElementById(eye);
    eyeImg.classList.remove('d-none');
}

/**
 * Checks if it shows the image of the open eye or closed eye while hiding the lock-image.
 * 
 * @param {string} id - Passes an id the image which source will be changed.
 * @param {string} lock - Passes an id of an image.
 * @param {string} input - Uses an id of an input as parameter.
 */
function visibilityOnOff(id, lock, input) {
    showRightVisibility(id, input);
    disappearLock(lock);
}

/**
 * Checks if the source of the image shows that the image is a closed eye. 
 * If so, the open eye displays.
 * If not, the closed eye shows up.
 * 
 * @param {string} id - Passes an id of the image which source will be changed.
 * @param {string} input - Uses an id of an input as parameter.
 */
function showRightVisibility(id, input) {
    let visibility = document.getElementById(id);
    if (visibility.src.includes('logInVisibilityOff.png')) {
        visibilityOn(id, input);
    } else {
        visibilityOff(id, input);
    }
}

/**
 * Shows the open-eye-image.
 * 
 * @param {string} id - Passes an id of the image which source will be changed.
 * @param {string} input - Uses an id of an input as parameter.
 */
function visibilityOn(id, input) {
    let visibilityOnOrOff = document.getElementById(id);
    let password = document.getElementById(input);
    visibilityOnOrOff.src = './img/registerOpenEye.png';
    visibilityOnOrOff.style.height = '13.5px';
    visibilityOnOrOff.style.width = '17px';
    password.type = "text";
}

/**
 * Shows the closed-eye-image.
 * 
 * @param {string} id - Passes an id of the image which source will be changed.
 * @param {string} input - Uses an id of an input as parameter.
 */
function visibilityOff(id, input) {
    let visibilityOnOrOff = document.getElementById(id);
    let password = document.getElementById(input);
    visibilityOnOrOff.src = './img/logInVisibilityOff.png';
    visibilityOnOrOff.style.height = '15px';
    password.type = "password";
}

/* ---------- FOCUS ON ELEMENT ---------- */

/**
 * Focusses on an element with the spedific id.
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function focusOn(id) {
    let element = document.getElementById(id);
    element.focus();
}

/* ---------- CHECKBOX ---------- */

/**
 * Checks if the source of the image with a specific id shows a checked checkbox and changes the source to the opposite.
 * 
 * @param {string} id - Uses an id of an image as parameter.
 */
function changeCheckbox(id) {
    let checkbox = document.getElementById(id);
    if (checkbox.src.includes('registerCheckedCheckbox.png')) {
        checkbox.src = './img/checkboxNotChecked.png';
    } else {
        checkbox.src = './img/registerCheckedCheckbox.png';
    }
}

/* ---------- OTHERS ---------- */

/**
 * Removes the red border of an specific element.
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function removeRedBorder(id) {
    let element = document.getElementById(id);
    element.classList.remove('redBorder');
}

/**
 * Hides a specific element by adding the css-property "display: none;".
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function removeDiv(id) {
    let element = document.getElementById(id);
    element.classList.add('d-none');
}