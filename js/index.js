// PROBLEMS:
// 1. Overlay when registration is successful not functioning (register.html)
// CURRENT USER: guest-login = firstName: Guest, lastName: '' / user-login = users[i] => both cases in LOCAL STORAGE!
// guest-login = G / user-login = first letters of names

let currentUser;

/* ---------- init ---------- */

async function initLogIn() {
    await loadUsers();
}

/* ---------- guest log in ---------- */

function guestLogIn() {
    currentUserIsGuest();
    redirectToSummary();
}

function currentUserIsGuest() {
    let guest = {
        firstName: 'Guest', 
        lastName: ''
    }
    currentUser = guest;
    setLocalStorageItem('currentUser', currentUser);
}

function redirectToSummary() {
    window.location.href = "./summary.html";
}

/* ---------- log in ---------- */

function logIn(event) {
    noReload(event);
    let logInEmail = document.getElementById('logInEmail').value;
    let logInPassword = document.getElementById('logInPassword').value;
    let indexOfEmail = users.findIndex(user => user.email == logInEmail);
    let indexOfPassword = users.findIndex(user => user.password == logInPassword);
    if(userIsFound(indexOfEmail, indexOfPassword)) {
        console.log('user is found!', users[indexOfEmail]);
        currentUser = users[indexOfEmail];
        setLocalStorageItem('currentUser', currentUser);
        redirectToSummary();
    } else {
        showLogInFailed();
    }
}

function userIsFound(email, password) {
    if(email == password && email !== -1) {
        return true;
    } else {
        return false;
    }
}

function showLogInFailed() {
    addRedBorder('logInPassword');
    addDiv('logInFailed');
}