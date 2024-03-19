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
 * This function sets the variable "loggedIn" to true or false if it exists in the local storage.
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
 * 
 * @returns {object || null} - Returns an object, if the key 'users' is found or null if the key 'users' isn't found.
 */
async function usersExist() {
    return getItem('users');
}

/**
 * This function loads contact data asynchronously and sets the variable 'contacts' if there is an item in the remote storage with the key 'contacs'.
 */
async function loadContacts() {
    if(await contactsExist()) {
        contacts = JSON.parse(await getItem('contacts'));
    }
}

/**
 * This function is used to check if there is an item in the remote storage with the key 'contacts'.
 * 
 * @returns {object || null} - Returns an object, if the key 'contacts' is found or null if the key 'contacts' isn't found.
 */
async function contactsExist() {
    return getItem('contacts');
}