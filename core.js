/**
 * Created by nnt on 01-12-2014.
 */

window.addEventListener('DOMContentLoaded', startup, false);

var O_huntTimer;
var O_hornButton;

function startup() {
    log("core", TRACE, "Start up when DOMContentLoaded");

    // IMPORTANT!
    getHuntTimer();
    getHornButton();

}

function getHuntTimer() {
    O_huntTimer = document.getElementById('huntTimer');
    if (O_huntTimer == null) {
        log("core", WARNING, "NOT LOGIN!");
        chrome.extension.sendMessage({storage: 'MHO_login', value: 'no'});
    } else {
        log("core", WARNING, O_huntTimer.firstChild.textContent);
        chrome.extension.sendMessage({storage: 'MHO_login', value: 'yes'});
    }
}

function getHornButton() {

}

/*
// Content Script to save data.
chrome.extension.sendRequest({storage: 'foo', value: 'bar'});


// Content Script to get data.
chrome.extension.sendRequest({storage: 'foo'}, function(response) {
    console.log('foo => ' + response.storage);
});

*/