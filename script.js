let sheetId = '1eQIo-fk08uEp-iVe7ozu8vyge0fjjY1Jmow8lrPaByo';
let range = 'Sheet1!A1';  // Adjust the range as needed
let apiKey = 'AIzaSyCTLv7w6jZyjA9W6U4zhi16i7UB2rDyksU';  // Place your API key here
let clientId = '412847648639-u7h1eibnaao1ebmecb4162blchdnjbgq.apps.googleusercontent.com';  // Place your client ID here

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/spreadsheets" })
        .then(() => { console.log("Sign-in successful"); },
              (err) => { console.error("Error signing in", err); });
}

function loadClient() {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => { console.log("GAPI client loaded for API"); },
              (err) => { console.error("Error loading GAPI client for API", err); });
}

function fetchData() {
    authenticate().then(loadClient).then(() => {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });
    }).then(response => {
        const value = response.result.values ? response.result.values[0][0] : 0;
        document.getElementById('result').innerText = `Current Value: ${value}`;
    }).catch(err => { console.error("Execute error", err); });
}

function updateData(newValue) {
    return gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: [[newValue]]
        }
    });
}

function addValue() {
    authenticate().then(loadClient).then(() => {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });
    }).then(response => {
        const currentValue = response.result.values ? parseInt(response.result.values[0][0]) : 0;
        const newValue = currentValue + parseInt(document.getElementById('value').value);
        return updateData(newValue);
    }).then(() => {
        document.getElementById('result').innerText = `Value updated successfully`;
        fetchData();
    }).catch(err => { console.error("Execute error", err); });
}

function subtractValue() {
    authenticate().then(loadClient).then(() => {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });
    }).then(response => {
        const currentValue = response.result.values ? parseInt(response.result.values[0][0]) : 0;
        const newValue = currentValue - parseInt(document.getElementById('value').value);
        return updateData(newValue);
    }).then(() => {
        document.getElementById('result').innerText = `Value updated successfully`;
        fetchData();
    }).catch(err => { console.error("Execute error", err); });
}

gapi.load("client:auth2", () => {
    gapi.auth2.init({ client_id: clientId });
});
