let loggedIn;
let users = [];
let contacts = [];
let colors = [
    'rgba(255,122,0,255)',
    'rgba(255,94,179,255)',
    'rgba(110,82,255,255)',
    'rgba(147,39,255,255)',
    'rgba(0,190,232,255)',
    'rgba(31,215,193,255)',
    'rgba(255,116,94,255)',
    'rgba(255,163,94,255)',
    'rgba(252,113,255,255)',
    'rgba(255,199,1,255)',
    'rgba(0,56,255,255)',
    'rgba(195,255,43,255)',
    'rgba(255,230,43,255)',
    'rgba(255,70,70,255)',
    'rgba(255,70,70,255)'
]

/* ---------- INIT-FUNCTION ---------- */

/**
 * This function initializes the registration process by setting the loggedIn-variable to false.
 * It is loading the logged-in-status, users and contacts asynchronously.
 */
async function initRegister() {
    setLoggedInFalse();
    loadLoggedIn();
    await loadUsers();
    await loadContacts();
}

/**
 * This function stores an item in the browser's local storage with the key "loggedIn" and the value "false".
 */
function setLoggedInFalse() {
    loggedIn = false;
    setLocalStorageItem('loggedIn', loggedIn);
}

/**
 * This function sets the variable "loggedIn" if it exists in the local storage under the same name.
 */
function loadLoggedIn() {
    if (loggedInExists()) {
        loggedIn = getLoggedIn();
    }
}

/**
 * This function checks if a value under the key "loggedIn" exists in the browser's local storage.
 * 
 * @returns {boolean} - Returns true or false, if the value of the key "loggedIn" is true or false.
 */
function loggedInExists() {
    return getLoggedIn() === false || getLoggedIn() === true;
}

/**
 * This function returns the value with the key 'loggedIn' from the local storage.
 * 
 * @returns {object || string || null} - Returns an object or a string when the key is found and null when the key doesn't exist in the local storage.
 */
function getLoggedIn() {
    return getLocalStorageItem('loggedIn');
}

/**
 * This function loads user data asynchronously and sets the variable 'users' if there is an item in the remote storage with the key 'users'.
 */
async function loadUsers() {
    if(await usersExist()) {
        users = JSON.parse(await getItem('users'));
    }
}

/**
 * This function is used to check if there is an item in the remote storage with the key 'users'.
 * @returns {object || null} - Returns an object, if the key 'users' is found or null if the key 'users' isn't found.
 */
async function usersExist() {
    return getItem('users');
}

async function loadContacts() {
    if(await contactsExist()) {
        contacts = JSON.parse(await getItem('contacts'));
    }
}

async function contactsExist() {
    return getItem('contacts');
}

/* ---------- register ---------- */

async function register(event) {
    noReload(event);
    await checkPassword()
}

function noReload(event) {
    event.preventDefault();
}
 
async function checkPassword() {
    let firstPassword = document.getElementById('registerFirstPassword').value;
    let secondPassoword = document.getElementById('registerSecondPassword').value;
    if(firstPassword == secondPassoword) {
        await signUpSuccessfully();
    } else {
        showNoPasswordMatch();
    }
}

async function signUpSuccessfully() {
    let createdAt = new Date().getTime();
    await createUser(createdAt);
    await createContact(createdAt);
    showInformationSignedUpSuccessfully();
    setTimeout(() => {
        hideInformationSignedUpSuccessfully()
        redirectToLogIn();
    }, 2000);
}

async function createUser(createdAt) {
    addUser(createdAt);
    await saveUsers();
}

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

function getFirstName() {
    let name = document.getElementById('registerName');
    let nameArray = name.value.split(' ');
    return nameArray[0];
}

function getLastName() {
    let name = document.getElementById('registerName');
    let nameArray = name.value.split(' ');
    return nameArray[nameArray.length -1];
}

async function saveUsers() {
    await setItem('users', users);
}

async function createContact(createdAt) {
    addContact(createdAt);
    await saveContact();
}

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

function selectColor() {
    let randomNumber = Math.round(Math.random() * 15);
    return colors[randomNumber];
}

async function saveContact() {
    await setItem('contacts', contacts);
}

function showInformationSignedUpSuccessfully() {
    let registerSignUpSuccessfully = document.getElementById('registerSignUpSuccessfully');
    registerSignUpSuccessfully.classList.remove('d-none');
}

function hideInformationSignedUpSuccessfully() {
    let registerSignUpSuccessfully = document.getElementById('registerSignUpSuccessfully');
    registerSignUpSuccessfully.classList.add('d-none');
}

function redirectToLogIn() {
    window.location.href = "./index.html";
}

function showNoPasswordMatch() {
    addRedBorder('registerSecondPassword');
    addDiv('informNotTheSamePassword');
}

function addRedBorder(id) {
    let element = document.getElementById(id);
    element.classList.add('redBorder');
}

function addDiv(id) {
    let element = document.getElementById(id);
    element.classList.remove('d-none');
}

/* ---------- password-visibility ---------- */

function showEyeOrLock(input, lock, eye) {
    if(passwordIsEmpty(input)) {
        showLock(lock, eye);
    } else {
        showEye(eye, lock);
    }
}

function passwordIsEmpty(input) {
    let password = document.getElementById(input).value;
    return password == '';
}

function showLock(lock, eye) {
    appearLock(lock);
    disappearEye(eye);
}

function appearLock(lock) {
    let lockImg = document.getElementById(lock);
    lockImg.classList.remove('d-none');
}

function disappearEye(eye) {
    let eyeImg = document.getElementById(eye);
    eyeImg.classList.add('d-none');
}

function showEye(eye, lock) {
    disappearLock(lock);
    appearLogInEye(eye);
}

function disappearLock(lock) {
    let lockImg = document.getElementById(lock);
    lockImg.classList.add('d-none');
}

function appearLogInEye(eye) {
    let eyeImg = document.getElementById(eye);
    eyeImg.classList.remove('d-none');
}

function visibilityOnOff(id, lock, input) {
    showRightVisibility(id, input);
    disappearLock(lock);
}

function showRightVisibility(id, input) {
    let visibility = document.getElementById(id);
    if (visibility.src.includes('logInVisibilityOff.png')) {
        visibilityOn(id, input);
    } else {
        visibilityOff(id, input);
    }
}

function visibilityOn(id, input) {
    let visibilityOnOrOff = document.getElementById(id);
    let password = document.getElementById(input);
    visibilityOnOrOff.src = './img/registerOpenEye.png';
    visibilityOnOrOff.style.height = '13.5px';
    visibilityOnOrOff.style.width = '17px';
    password.type = "text";
}

function visibilityOff(id, input) {
    let visibilityOnOrOff = document.getElementById(id);
    let password = document.getElementById(input);
    visibilityOnOrOff.src = './img/logInVisibilityOff.png';
    visibilityOnOrOff.style.height = '15px';
    password.type = "password";
}

/* ---------- focus on element ---------- */

function focusOn(id) {
    let element = document.getElementById(id);
    element.focus();
}

/* ---------- "checkbox" ---------- */

function changeCheckbox(id) {
    let checkbox = document.getElementById(id);
    if (checkbox.src.includes('registerCheckedCheckbox.png')) {
        checkbox.src = './img/checkboxNotChecked.png';
    } else {
        checkbox.src = './img/registerCheckedCheckbox.png';
    }
}

/* ---------- others ---------- */

function removeRedBorder(id) {
    let element = document.getElementById(id);
    element.classList.remove('redBorder');
}

function removeDiv(id) {
    let element = document.getElementById(id);
    element.classList.add('d-none');
}