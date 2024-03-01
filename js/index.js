/* ---------- password-visibility and lock-img ---------- */

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