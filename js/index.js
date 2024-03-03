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
        // CURRENT USER: guest-login = firstName: Guest, lastName: '' / user-login = users[i] => both cases in LOCAL STORAGE!
        // guest-login = G / user-login = first letters of names
    }
}

function userIsFound(email, password) {
    if(email == password) {
        return true;
    } else {
        return false;
    }
}