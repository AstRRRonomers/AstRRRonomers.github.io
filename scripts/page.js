// Update progress bar
function unityProgress(gameInstance, progress) {
    if (!gameInstance.progress) {
        gameInstance.loader = document.querySelector('#loader');
        gameInstance.progress = document.querySelector('#progress');
        gameInstance.loading = document.querySelector('#loading');
        document.dispatchEvent(new CustomEvent('UnityProgressStart'));
    }
    gameInstance.progress.style.width = (100 * progress) + '%';
    if (progress === 1) {
        document.querySelector('#startVR').attributes.removeNamedItem('disabled');
        document.querySelector('#loading').hidden = true;
        document.querySelector('#finished').hidden = false;
    }
}

// Parsing the url parameters
function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

// Redirect if there is no auth code.
window.addEventListener('load', (event) => {
    let authCode = getUrlVars()["code"];
    if (authCode === undefined) {
        console.log('No Auth Code, redirecting...');
        location.href = 'https://astronomy3r.herokuapp.com/';
    } else {
        window.authCode = authCode;
    }
});

// Start VR when user clicks button
function startVR() {
    // Get Form Data.
    window.sheetUrl = document.querySelector('input[name="sheetUrl"]').value;
    window.sheetRange = document.querySelector('input[name="range"]').value;

    window.dataType = document.querySelector('select[name="dataType"]').value;

    // Data validation for sheetUrl.
    // Note: this is the simplest implementation of data validation.
    // It is possible to do much better.
    if (window.sheetUrl === '') {
        document.querySelector('.error[data-for="sheetUrl"]').textContent = 'This field is required.';
        return;
    }

    // Data Validation for range
    // TODO: Check if range format is incorrect
    if (window.sheetRange === '') {
        window.sheetRange = 'A2:B'; // set to default if sheet range is empty
    }

    // Start VR.
    document.dispatchEvent(new CustomEvent('UnityLoaded'));
    window.xrManager.gameInstance.SendMessage('GameMaster', 'WorldSetup');
}