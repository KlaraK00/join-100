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
        alert('Sorry for saving error!');
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
        alert('Sorry for loading error!');
    }
}

function getValueFromJson(json) {
    return json.data.value;
}

function setLocalStorageItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageItem(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return false;
    }
}