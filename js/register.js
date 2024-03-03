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

/* ---------- init ---------- */

async function initRegister() {
    await loadUsers();
    await loadContacts();
}

async function loadUsers() {
    if(await usersExist()) {
        users = JSON.parse(await getItem('users'));
    }
}

async function usersExist() {
    return getItem('users');
}

async function loadContacts() {
    if(await contatcsExist()) {
        contacts = JSON.parse(await getItem('contacts'));
    }
}

async function contatcsExist() {
    return getItem('contacts');
}

/* ---------- register ---------- */

async function register(event) {
    noReload(event);
    await checkPassword();
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
    // await showOverlaySignedUpSuccessfully(); // ERROR: DIALOG IS NOT DEFINED!
    redirectToLogIn();
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
        createdAt: createdAt,
        color: selectColor(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: ''
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

// the function below is not functioning!
// async function showOverlaySignedUpSuccessfully() {
//     dialog.showModal();
//     setTimeout(() => {
//         dialog.close();
//     }, 1000);
// }

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