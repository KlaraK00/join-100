/**
 * This function is used set an Item in the remote storage. // genauer! umgewandelt in Text etc
 * 
 * @param {string} key - This is the key of the item you want to save in the remote storage.
 * @param {object} value - This is the value of the item you want to save in the remote storage.
 * @returns {object || error} - returns a JSON or an error
 */
async function setItem(key, value) {
    let payload = {key, value, token: STORAGE_TOKEN};
    try {
        let response = await fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)});
        if (response.ok) {
            let responseAsJson = await response.json();
            return responseAsJson;
        } else {
            throw response.status;
        }
    } catch {
        var savingErrorDiv = document.querySelector('.savingError');
        savingErrorDiv.classList.remove('d-none')
    }
}

async function getItem(key) {
    let url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        let response = await fetch(url);
        if (response.ok) {
            let responseAsJson = await response.json();
            return getValueFromJson(responseAsJson);
        } else {
            throw response.status;
        }
    } catch {
        var savingErrorDiv = document.querySelector('.loadingError');
        savingErrorDiv.classList.remove('d-none')
    }
}

function closeSavingError() {
    var savingErrorDiv = document.querySelector('.savingError');
    savingErrorDiv.classList.add('d-none')
}

function closeLoadingError() {
    var savingErrorDiv = document.querySelector('.loadingError');
    savingErrorDiv.classList.add('d-none')
}

function getValueFromJson(json) {
    return json.data.value;
}

function setLocalStorageItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
    try {
        console.log('local storage returned ', JSON.parse(localStorage.getItem(key)));
        return JSON.parse(localStorage.getItem(key));
    } catch(e) {
        console.log('load local storage, but there is error ', e);
        return false;
    }
}