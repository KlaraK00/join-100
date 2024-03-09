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
// https://www.w3schools.com/howto/howto_js_redirect_webpage.asp ==> replace() kann man td noch zurück beim logOut

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
let rememberMe;

/* ---------- init ---------- */

async function initLogIn() {
    loadCurrentUser();
    loadRememberMe();
    if(rememberCurrentUser()) {
        setLoggedInTrue();
        await loadUsers();
        let index = users.findIndex(u => u.createdAt == currentUser.createdAt);
        showLogInSucceed(index);
    } else {
        setRememberMeFalse();
        setLoggedInFalse();
        loadLoggedIn();
        loadRememberMe();
        await loadUsers();
        clearLogInForm();
    }
}

function rememberCurrentUser() {
    return (currentUser && currentUser.firstName !== 'Guest' && currentUser !== '') && rememberMe === true;
}

function loadRememberMe() {
    if (rememberMeExists()) {
        rememberMe = getRememberMe();
    }
}

function rememberMeExists() {
    return getRememberMe() === false || getRememberMe() === true;
}

function getRememberMe() {
    return getLocalStorageItem('rememberMe');
}

function loadCurrentUser() {
    if (currentUserExists()) {
        currentUser = getCurrentUser();
    }
}

function currentUserExists() {
    return getCurrentUser() && getCurrentUser()!== "";
}

function getCurrentUser() {
    return getLocalStorageItem('currentUser');
  }

/* ---------- guest log in ---------- */

function guestLogIn() {
    setFirstVisitSummaryTrue();
    setLoggedInTrue();
    currentUserIsGuest();
    clearLogInForm();
    redirectToSummary();
}

function setLoggedInTrue() {
    loggedIn = true;
    setLocalStorageItem('loggedIn', loggedIn);
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

/* ---------- "checkbox" ---------- */

function changeLogInCheckbox() {
    let checkbox = document.getElementById('logInCheckbox');
    if (checkbox.src.includes('registerCheckedCheckbox.png')) {
        checkbox.src = './img/checkboxNotChecked.png';
        setRememberMeFalse();
    } else {
        checkbox.src = './img/registerCheckedCheckbox.png';
        setRememberMeTrue();
    }
}

/* ---------- log in ---------- */

function logIn(event) {
    setLoggedInTrue();
    // checkRememberMe();
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

// function checkRememberMe() {
//     if(rememberMeCheckboxIsChecked()) {
//         setRememberMeTrue();
//     }
// }

// function rememberMeCheckboxIsChecked() {
//     let checkbox = document.getElementById('logInCheckbox');
//     return checkbox.src.toLowerCase().includes('checkedcheckbox');
// }

function setRememberMeFalse() {
    rememberMe = false;
    setLocalStorageItem('rememberMe', rememberMe);
}

function setRememberMeTrue() {
    rememberMe = true;
    setLocalStorageItem('rememberMe', rememberMe);
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
    setFirstVisitSummaryFalse();
    setLoggedInFalse();
    setCurrentUser('');
    window.location.href = "./index.html";
}