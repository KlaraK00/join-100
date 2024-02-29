function logInShowEyeOrLock() {
    if(logInPasswordIsEmpty()) {
        logInShowLock();
    } else {
        logInShowEye();
    }
}

function logInPasswordIsEmpty() {
    let logInPassword = document.getElementById('logInPassword').value;
    return logInPassword == '';
}

function logInShowLock() {
    let logInLock = document.getElementById('logInLock');
    let logInVisibilityOff = document.getElementById('logInVisibilityOff');
    logInLock.classList.remove('d-none');
    logInVisibilityOff.classList.add('d-none');
}

function logInShowEye() {
    let logInLock = document.getElementById('logInLock');
    let logInVisibilityOff = document.getElementById('logInVisibilityOff')
    logInLock.classList.add('d-none');
    logInVisibilityOff.classList.remove('d-none');
}