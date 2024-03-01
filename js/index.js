let logInRememberMe = document.getElementById('logInRememberMe');

logInRememberMe.addEventListener('change', () => {
    if (logInRememberMe.checked) {
        registerShowCheckedCheckbox();
    } else {
        registerShowNoCheckedCheckbox();
    }
})

function registerShowCheckedCheckbox() {

    console.log('checked');
}

function registerShowNoCheckedCheckbox() {

    console.log('not checked');
}

function logInShowEyeOrLock() {
    if(logInPasswordIsEmpty()) {
        logInShowLock();
        console.log('input is empty');
    } else {
        logInShowEye();
        console.log('input is not empty');
    }
}

function logInPasswordIsEmpty() {
    let logInPassword = document.getElementById('logInPassword').value;
    return logInPassword == '';
}

function logInShowLock() {
    appearLogInLock();
    disappearLogInEye();
}

function appearLogInLock() {
    let logInLock = document.getElementById('logInLock');
    logInLock.classList.remove('d-none');
}

function disappearLogInEye() {
    let logInVisibilityOnOff = document.getElementById('logInVisibilityOnOrOff');
    logInVisibilityOnOff.classList.add('d-none');
}

function logInShowEye() {
    disappearLogInLock();
    appearLogInEye();
}

function disappearLogInLock() {
    let logInLock = document.getElementById('logInLock');
    logInLock.classList.add('d-none');
}

function appearLogInEye() {
    let logInVisibilityOnOff = document.getElementById('logInVisibilityOnOrOff');
    logInVisibilityOnOff.classList.remove('d-none');
}

function logInVisibilityOnOff() {
    showRightVisibility();
    disappearLogInLock();
    console.log('you clicked on the eye');
}

function showRightVisibility() {
    let logInVisibilityOnOff = document.getElementById('logInVisibilityOnOrOff');
    if (logInVisibilityOnOff.src.includes('logInVisibilityOff.png')) {
        visibilityOn();
    } else {
        visibilityOff();
    }
}

function visibilityOn() {
    let logInVisibilityOnOff = document.getElementById('logInVisibilityOnOrOff');
    let logInPassword = document.getElementById('logInPassword');
    logInVisibilityOnOff.src = './img/registerOpenEye.png';
    logInPassword.type = "text";
}

function visibilityOff() {
    let logInVisibilityOnOff = document.getElementById('logInVisibilityOnOrOff');
    let logInPassword = document.getElementById('logInPassword');
    logInVisibilityOnOff.src = './img/logInVisibilityOff.png';
    logInPassword.type = "password";
}

function focusOnPswInput() {
    let logInPassword = document.getElementById('logInPassword');
    logInPassword.focus();
}

function focusOnEmailInput() {
    let logInEmail = document.getElementById('logInEmail');
    logInEmail.focus();
}