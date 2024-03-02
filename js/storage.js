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
        alert('Sorry for loading error!');
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