let currentUser;

/* ---------- init ---------- */

async function initLogIn() {
    await loadUsers();
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
        // CURRENT USER: guest-login = firstName: Guest, lastName: '' / user-login = users[i] => both cases in LOCAL STORAGE!
        // guest-login = G / user-login = first letters of names
    } else {
        showLogInFailed();
        console.log('user is not found!');
    }
}

function userIsFound(email, password) {
    if(email == password && email !== -1) {
        return true;
    } else {
        return false;
    }
}

function redirectToSummary() {
    window.location.href = "./summary.html";
}

function showLogInFailed() {
    let password = document.getElementById('logInPassword');
    password.classList.add('redBorder');
    let logInFailed = document.getElementById('logInFailed');
    logInFailed.classList.remove('d-none');
}