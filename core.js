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
        localStorage.MHO_login = 0;
    } else {
        log("core", WARNING, O_huntTimer.firstChild.textContent);
        localStorage.MHO_login = 1;
    }
}

function getHornButton() {

}