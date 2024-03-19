
/* ---------- PASSWORD-VISIBILITY ---------- */

/**
 * Shows an eye or a lock as image on a specific input.
 * 
 * @param {string} input - Uses an id of an input as parameter.
 * @param {string} lock - Passes an id of an image.
 * @param {string} eye - Passes an id of an image.
 */
function showEyeOrLock(input, lock, eye) {
    if(passwordIsEmpty(input)) {
        showLock(lock, eye);
    } else {
        showEye(eye, lock);
    }
}

/**
 * Tests if the value of the input is empty.
 * 
 * @param {string} input - Passes an id of an input.
 * @returns {boolean} - Returns true if the password-value is nothing.
 */
function passwordIsEmpty(input) {
    let password = document.getElementById(input).value;
    return password == '';
}

/**
 * Shows the lock image.
 * 
 * @param {string} lock - Passes an id of an image.
 * @param {string} eye - Passes an id of an image.
 */
function showLock(lock, eye) {
    appearLock(lock);
    disappearEye(eye);
}

/**
 * Shows the lock image by removing the css-property "display: none;".
 * 
 * @param {string} lock - Passes an id of an image.
 */
function appearLock(lock) {
    let lockImg = document.getElementById(lock);
    lockImg.classList.remove('d-none');
}

/**
 * Hides the eye image.
 * 
 * @param {string} eye - Passes an id of an image.
 */
function disappearEye(eye) {
    let eyeImg = document.getElementById(eye);
    eyeImg.classList.add('d-none');
}

/**
 * Shows the eye image.
 * 
 * @param {string} lock - Passes an id of an image.
 * @param {string} eye - Passes an id of an image.
 */
function showEye(eye, lock) {
    disappearLock(lock);
    appearLogInEye(eye);
}

/**
 * Hides the lock image by adding to it the css-property "display: none;".
 * 
 * @param {string} lock - Passes an id of an image.
 */
function disappearLock(lock) {
    let lockImg = document.getElementById(lock);
    lockImg.classList.add('d-none');
}

/**
 * Shows the eye image through removing the css-property "display: none;".
 * 
 * @param {string} eye - Passes an id of an image.
 */
function appearLogInEye(eye) {
    let eyeImg = document.getElementById(eye);
    eyeImg.classList.remove('d-none');
}

/**
 * Checks if it shows the image of the open eye or closed eye while hiding the lock-image.
 * 
 * @param {string} id - Passes an id the image which source will be changed.
 * @param {string} lock - Passes an id of an image.
 * @param {string} input - Uses an id of an input as parameter.
 */
function visibilityOnOff(id, lock, input) {
    showRightVisibility(id, input);
    disappearLock(lock);
}

/**
 * Checks if the source of the image shows that the image is a closed eye. 
 * If so, the open eye displays.
 * If not, the closed eye shows up.
 * 
 * @param {string} id - Passes an id of the image which source will be changed.
 * @param {string} input - Uses an id of an input as parameter.
 */
function showRightVisibility(id, input) {
    let visibility = document.getElementById(id);
    if (visibility.src.includes('logInVisibilityOff.png')) {
        visibilityOn(id, input);
    } else {
        visibilityOff(id, input);
    }
}

/**
 * Shows the open-eye-image.
 * 
 * @param {string} id - Passes an id of the image which source will be changed.
 * @param {string} input - Uses an id of an input as parameter.
 */
function visibilityOn(id, input) {
    let visibilityOnOrOff = document.getElementById(id);
    let password = document.getElementById(input);
    visibilityOnOrOff.src = './img/registerOpenEye.png';
    visibilityOnOrOff.style.height = '13.5px';
    visibilityOnOrOff.style.width = '17px';
    password.type = "text";
}

/**
 * Shows the closed-eye-image.
 * 
 * @param {string} id - Passes an id of the image which source will be changed.
 * @param {string} input - Uses an id of an input as parameter.
 */
function visibilityOff(id, input) {
    let visibilityOnOrOff = document.getElementById(id);
    let password = document.getElementById(input);
    visibilityOnOrOff.src = './img/logInVisibilityOff.png';
    visibilityOnOrOff.style.height = '15px';
    password.type = "password";
}

/* ---------- FOCUS ON ELEMENT ---------- */

/**
 * Focusses on an element with the spedific id.
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function focusOn(id) {
    let element = document.getElementById(id);
    element.focus();
}

/* ---------- CHECKBOX ---------- */

/**
 * Checks if the source of the image with a specific id shows a checked checkbox and changes the source to the opposite.
 * 
 * @param {string} id - Uses an id of an image as parameter.
 */
function changeCheckbox(id) {
    let checkbox = document.getElementById(id);
    if (checkbox.src.includes('registerCheckedCheckbox.png')) {
        checkbox.src = './img/checkboxNotChecked.png';
    } else {
        checkbox.src = './img/registerCheckedCheckbox.png';
    }
}

/* ---------- OTHERS ---------- */

/**
 * Removes the red border of an specific element.
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function removeRedBorder(id) {
    let element = document.getElementById(id);
    element.classList.remove('redBorder');
}

/**
 * Hides a specific element by adding the css-property "display: none;".
 * 
 * @param {string} id - Passes an id of a specific element.
 */
function removeDiv(id) {
    let element = document.getElementById(id);
    element.classList.add('d-none');
}