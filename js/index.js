let currentUser;
let rememberMe;

/* ---------- INIT ---------- */

/**
 * Initializes the log-in-process.
 * If the variable "currentUser" exists and the variable "rememberMe" is true,
 * the current User is logged in and if not, you stay on the log-in-site.
 */
function initLogIn() {
    loadCurrentUser();
    loadRememberMe();
    if(rememberCurrentUser()) {
        logInWithCurrentUser();
    } else {
        stayOnLogInSite();
    }
}

/**
 * Secure the current User, if the variable "currentUser" exists in the local storage.
 */
function loadCurrentUser() {
    if (currentUserExists()) {
        currentUser = getCurrentUser();
    }
}

/**
 * Checks if the variable "currentUser" exists in the local storage.
 * 
 * @returns {boolean} - Returns true if the variable "currentUser" exists in the local storage. If not, it returns false.
 */
function currentUserExists() {
    return getCurrentUser() && getCurrentUser()!== "";
}

/**
 * Gets the value which is found under the key "currentUser" in the local storage.
 * 
 * @returns {object || null} - Returns a JSON if there is value under the key "currentUser" in the browser's local storage. Returns "null" if there is no current user.
 */
function getCurrentUser() {
    return getLocalStorageItem('currentUser');
}

/**
 * Checks if there exists a specific value (true or false) under the key "rememberMe" in the local storage.
 * 
 * @returns {boolean} - Returns true, if the variable "rememberMe" exists under the value "false" or "true" in the local storage. If not, it returns false.
 */
function rememberMeExists() {
    return getRememberMe() === false || getRememberMe() === true;
}

/**
 * Gets the value under the key "rememberMe" in the local storage.
 * 
 * @returns {boolean || null} - Returns the value ("true" or "false") of the key "rememberMe" in the browser's local storage or "null" if there is no value found.
 */
function getRememberMe() {
    return getLocalStorageItem('rememberMe');
}

/**
 * Checks if there exists the variable currentUser and if the variable "rememberMe" is "true".
 * 
 * @returns {boolean} - Returns "true" if there is a current user and the variable "rememberMe" is "true".
 */
function rememberCurrentUser() {
    return (currentUser && currentUser.firstName !== 'Guest' && currentUser !== '') && rememberMe === true;
}

/**
 * Logs the current user in with an asynchroniously function.
 * It sets the variable "loggedIn" to true, loads user data and informs the user clearly that the log in succeed.
 */
async function logInWithCurrentUser() {
    setLoggedInTrue();
    await loadUsers();
    let index = users.findIndex(u => u.createdAt == currentUser.createdAt);
    showLogInSucceed(index);
}

/**
 * Stores the value "true" under the key "loggedIn" in the local storage.
 */
function setLoggedInTrue() {
    loggedIn = true;
    setLocalStorageItem('loggedIn', loggedIn);
}

/**
 * Shows the user clearly that the log in succeed.
 * It stores the user-object under the key "currentUser" in the local storage, clears the log-in-formular and redirects to the summary-site.
 * 
 * @param {number} index - Uses the specific user-index-number of the current user as parameter to make sure to store the right data.
 */
function showLogInSucceed(index) {
    setCurrentUser(users[index]);
    clearLogInForm();
    redirectToSummary();
}

/**
 * Sets an item in the local storage under the key "currentUser" with the value that is an user-object.
 * 
 * @param {object} user - Passes an user-object.
 */
function setCurrentUser(user) {
    currentUser = user;
    setLocalStorageItem('currentUser', currentUser);
}

/**
 * Clears the log-in-form.
 */
function clearLogInForm() {
    let logInEmail = document.getElementById('logInEmail');
    let logInPassword = document.getElementById('logInPassword');
    logInEmail.value = '';
    logInPassword.value = '';
}

/**
 * Redirects to the summary-site.
 */
function redirectToSummary() {
    window.location.href = "./summary.html";
}

/**
 * Starts loading the log-in-site.
 * Sets all needed and loads all required variables. It clears also the log-in-formular.
 */
async function stayOnLogInSite() {
    setRememberMeFalse();
    setLoggedInFalse();
    loadLoggedIn();
    loadRememberMe();
    await loadUsers();
    clearLogInForm();
}

/**
 * Stores the key "rememberMe" in the localStorage under the value "false".
 */
function setRememberMeFalse() {
    rememberMe = false;
    setLocalStorageItem('rememberMe', rememberMe);
}

/**
 * Replaces the variable "rememberMe" with the value from the local storage under the key "rememberMe" if the key is found.
 */
function loadRememberMe() {
    if (rememberMeExists()) {
        rememberMe = getRememberMe();
    }
}

/* ---------- GUEST-LOG-IN ---------- */

/**
 * Initializes the log-in-process for a guest.
 */
function guestLogIn() {
    setFirstVisitSummaryTrue();
    setLoggedInTrue();
    currentUserIsGuest();
    clearLogInForm();
    redirectToSummary();
}

/**
 * Stores the guest-object with the key "currentUser" in the browser's local storage.
 */
function currentUserIsGuest() {
    let guest = {
        firstName: 'Guest', 
        lastName: ''
    }
    setCurrentUser(guest);
}

/* ---------- CHECKBOX ---------- */

/**
 * Changes the source from a checked-checkbox-image to a not-checked-checkbox-image and sets the variable "rememberMe" to false.
 * If the source of the checkbox shows a not-checked-image then the opposite happens.
 */
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

/**
 * Stores the value "true" under the key "rememberMe" in the localStorage.
 */
function setRememberMeTrue() {
    rememberMe = true;
    setLocalStorageItem('rememberMe', rememberMe);
}

/* ---------- LOG IN ---------- */

/**
 * Initializes the log-in-process. If a user is found there is a successfull log in. If not, the log in doesn't happen.
 * 
 * @param {Event} event - The event object representing the log in event.
 */
function logIn(event) {
    setLoggedInTrue();
    noReload(event);
    let logInEmail = document.getElementById('logInEmail').value;
    let logInPassword = document.getElementById('logInPassword').value;
    let indexOfEmail = users.findIndex(user => user.email == logInEmail);
    let indexOfPassword = users.findIndex(user => user.password == logInPassword);
    if(userIsFound(indexOfEmail, indexOfPassword)) {
        showLogInSucceed(indexOfEmail);
        setFirstVisitSummaryTrue();
    } else {
        showLogInFailed();
    }
}

/**
 * Checks if the email and the password belongs to an user.
 * 
 * @param {number} email - Uses the found index of the email as a parameter.
 * @param {number} password - Passes the found index of the password.
 * @returns {boolean} - Returns true if the email and the password belongs to the same user.
 */
function userIsFound(email, password) {
    return email == password && email !== -1;
}

/**
 * Informs the user that the log in failed.
 */
function showLogInFailed() {
    addRedBorder('logInPassword');
    addDiv('logInFailed');
}

/* ---------- LOG OUT ---------- */

/**
 * Initializes the log-out-process.
 */
function logOut() {
    setFirstVisitSummaryFalse();
    setLoggedInFalse();
    setCurrentUser('');
    window.location.href = "./index.html";
}