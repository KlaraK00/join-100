/* ---------- REMOTE STORAGE ---------- */

/**
 * This function is used to try to set an Item in the remote storage. If there is an error, the error will be returned. // genauer! umgewandelt in Text etc
 * 
 * @param {string} key - This is the key of the item you want to save in the remote storage.
 * @param {object} value - This is the value of the item you want to save in the remote storage.
 * @returns {object || error} - returns a JSON or an error
 */
async function setItem(key, value) {
    let payload = {key, value, token: STORAGE_TOKEN};
    try {
        return tryToSetItem(payload);
    } catch {
        showSavingError();
    }
}

/**
 * This function is used to store a value in the remote storage by sending a POST request to the specified URL.
 * 
 * @param {object} payload - The payload object is containing the key, value and token that should be stored.
 * @returns {object} - The response as json of a promise.
 * @throws {number} - The HTTP status code returned by the server if the storage operation fails.
 */
async function tryToSetItem(payload) {
    let response = await fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)});
    if (response.ok) {
        let responseAsJson = await response.json();
        return responseAsJson;
    } else {
        throw response.status;
    }
}

/**
 * This function shows that a saving error occured.
 */
function showSavingError() {
    var savingErrorDiv = document.querySelector('.savingError');
    savingErrorDiv.style.display = 'flex';
}

/**
 * This function is used to get an item from the remote storage with a specific key. It generates an url with the storage-url, key and token.
 * 
 * @param {string} key - The key under which the value is stored.
 * @returns {object || error} - Returns a JSON or an error.
 */
async function getItem(key) {
    let url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        return tryToGetItem(url);
    } catch {
        showLoadingError();
    }
}

/**
 * This function is used to fetch a value from the specific URL.
 * 
 * @param {string} url - The URL which fetches the value.
 * @returns {object} - The response as json of a promise.
 * @throws {number} - The HTTP status code returned by the server if an error occurs during the fetching process.
 */
async function tryToGetItem(url) {
    let response = await fetch(url);
    if (response.ok) {
        let responseAsJson = await response.json();
        return getValueFromJson(responseAsJson);
    } else {
        throw response.status;
    }
}

/**
 * This function returns the value from a JSON.
 * 
 * @param {object} json - The JSON object from which to get the value.
 * @returns {object} - The value from the JSON.
 */
function getValueFromJson(json) {
    return json.data.value;
}

/**
 * This function shows that a loading error occured.
 */
function showLoadingError() {
    var savingErrorDiv = document.querySelector('.loadingError');
    savingErrorDiv.classList.remove('d-none');
}

/**
 * This function hides that a saving error occured.
 */
function closeSavingError() {
    var savingErrorDiv = document.querySelector('.savingError');
    savingErrorDiv.classList.add('d-none')
}

/**
 * This function hides that a loading error occured.
 */
function closeLoadingError() {
    var savingErrorDiv = document.querySelector('.loadingError');
    savingErrorDiv.classList.add('d-none')
}

/* ---------- LOCAL STORAGE ---------- */

/**
 * This function stores the value of an item in the browser's local storage under a specific key.
 * 
 * @param {string} key - The key of the item.
 * @param {object} value - The value of the item. 
 */
function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

 /**
  * This function optains the value of an item from the browser's local storage based on the specific key.
  * 
  * @param {string} key - The key to optain the value from the local storage.
  * @returns {object || null} - The optained value or null if the key does not exist in the local storage.
  */
function getLocalStorageItem(key) {
    return JSON.parse(localStorage.getItem(key));
}