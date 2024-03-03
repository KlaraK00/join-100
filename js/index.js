// 1. Overlay when registration is successful not functioning (register.html)
// 2. input auto fill in background is lightBlue. Can't change it to transparent.(register.html & index.html)
// 3. NavBar id "userNavar"
// 4. contact needs createdAt as an ID and as same as contacts / push in contacts
// guest-login = G / user-login = first letters of names

let currentUser;

/* ---------- init ---------- */

async function initLogIn() {
    await loadUsers();
    if (currentUserExists()) {
        currentUser = getCurrentUser();
    }
}

function currentUserExists() {
    return currentUser && currentUser !== "";
}

function getCurrentUser() {
    return getLocalStorageItem('currentUser');
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