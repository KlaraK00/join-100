// 1. Overlay when registration is successful not functioning (register.html)
// 2. input auto fill in background is lightBlue. Can't change it to transparent.(register.html & index.html)
// 3. NavBar id "userNavar"
// 4. contact.html: need the key "createdAt" as an ID; new contact as same as contacts / push in contacts
// 5. href="contacts.html" for the arrow back in privacyPolicy.html instead of onclick="history.back()"
// "tasks" also in remote storage
// instead of "alert('Sorry for loading error!');" a better way, more costumized, better words
// responsive log in und register html
// privacy policy and legal notice another navbar if not logged in
// sign up only able when privacy policy is marked

// https://jsdoc.app/tags-returns FOR JSDOC!
// /**
//  * Returns the sum of a and b
//  * @param {number} a
//  * @param {number} b
//  * @returns {Promise<number>} Promise object represents the sum of a and b
//  */
// function sumAsync(a, b) {
//     return new Promise(function(resolve, reject) {
//         resolve(a + b);
//     });
// } ???

let currentUser;

/* ---------- init ---------- */

async function initLogIn() {
    await loadUsers();
    if (currentUserExists()) {
        currentUser = getCurrentUser();
    }
    clearLogInForm();
}

function currentUserExists() {
    return getCurrentUser() && getCurrentUser()!== "";
}

function getCurrentUser() {
    return getLocalStorageItem('currentUser');
  }

/* ---------- guest log in ---------- */

function guestLogIn() {
    currentUserIsGuest();
    clearLogInForm();
    redirectToSummary();
}

function currentUserIsGuest() {
    let guest = {
        firstName: 'Guest', 
        lastName: ''
    }
    setCurrentUser(guest);
}

function setCurrentUser(user) {
    currentUser = user;
    setLocalStorageItem('currentUser', currentUser);
}

function clearLogInForm() {
    let logInEmail = document.getElementById('logInEmail');
    let logInPassword = document.getElementById('logInPassword');
    logInEmail.value = '';
    logInPassword.value = '';
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
        showLogInSucceed(indexOfEmail);
    } else {
        showLogInFailed();
    }
}

function userIsFound(email, password) {
    return email == password && email !== -1;
}

function showLogInSucceed(index) {
    setCurrentUser(users[index]);
    clearLogInForm();
    redirectToSummary();
}

function showLogInFailed() {
    addRedBorder('logInPassword');
    addDiv('logInFailed');
}

/* ---------- log out ---------- */

function logOut() {
    window.location.replace("./index.html");
}