/**
 * Created by nnt on 01-12-2014.
 */

////////////////////////////////////////////////////////////////////////////////////
// Listener
////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded', contentLoaded, false);

////////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
// Handler
////////////////////////////////////////////////////////////////////////////////////

var MHO_data; // store user data
var MHO_login; // is login already
var O_huntTimer;
var O_hornButton;

function contentLoaded() {
    log("core", TRACE, "Handle DOMContentLoaded");
    syncUser(startup);
}

function startup() {
    log("core", TRACE, "Start up ...");

    if (MHO_login == 'yes') {
        getObjects();
    }

}

////////////////////////////////////////////////////////////////////////////////////
// sync User
////////////////////////////////////////////////////////////////////////////////////
function syncAgain(retry, callback, tracking) {
    log("core", ERROR, "syncAgain .. " + tracking);

    if (typeof localStorage.MHO_syncError == 'undefined')
        localStorage.MHO_syncError = tracking + " | ";
    else
        localStorage.MHO_syncError += tracking + " | ";

    if (typeof localStorage.MHO_syncErrorNum == 'undefined')
        localStorage.MHO_syncErrorNum = 0;
    else
        localStorage.MHO_syncErrorNum++;

    var timeout = localStorage.MHO_syncErrorNum * localStorage.MHO_syncErrorNum
        + Math.floor((Math.random() * 10) + 1);

    if (retry) {
        log("core", DEBUG, "syncAgain .. " + localStorage.MHO_syncErrorNum + " times again in (s): " + timeout);
        setTimeout(syncUser(callback), timeout * 1000);
    }
}

function syncUser(callback) {
    var url = "/managers/ajax/abtest.php";
    log("core", TRACE, "syncUser .. " + url);

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status == 200) {
                try {
                    MHO_data = JSON.parse(request.responseText);

                    if (typeof MHO_data.user.unique_hash != 'undefined') {
                        log("core", DEBUG, "syncUser .. successfully! " + MHO_data.user.unique_hash);
                        MHO_login = 'yes';

                        // call back if yes
                        if (callback != null) setTimeout(callback, 100);

                    } else if (typeof MHO_data.error_title != 'undefined') {
                        log("core", ERROR, "syncUser .. " + MHO_data.error_title);
                        MHO_login = 'no';
                        // do nothing
                    } else {

                        // check other errors!
                        syncAgain(false, callback, request.responseText);

                    }

                } catch (ex) {
                    syncAgain(true, callback, ex);
                }
            } else {
                syncAgain(true, callback, request.status);
            }
        }
    };
    request.send(null);
}

function refresh(msg) {
    log("core", ERROR, "refresh .. " + msg);

    if (typeof localStorage.MHO_refreshMgs == 'undefined')
        localStorage.MHO_refreshMgs = msg + " | ";
    else
        localStorage.MHO_refreshMgs += msg + " | ";

    if (typeof localStorage.MHO_refreshNum == 'undefined')
        localStorage.MHO_refreshNum = 0;
    else
        localStorage.MHO_refreshNum++;

    var timeout = localStorage.MHO_refreshNum * localStorage.MHO_refreshNum
        + Math.floor((Math.random() * 10) + 1);

    log("core", DEBUG, "refresh .. " + localStorage.MHO_refreshNum + " times again in (s): " + timeout);
    setTimeout(function () {
        location.reload()
    }, timeout * 1000);
}

function getObjects() {
    log("core", TRACE, "getObjects");

    // get huntTimer
    O_huntTimer = document.getElementById('huntTimer');
    if (O_huntTimer == null) {
        refresh("CANNOT get Hunt Timer");
        return;
    }

    log("core", DEBUG, O_huntTimer.firstChild.textContent);

    // get hornButton
    try {
        O_hornButton = document.getElementsByClassName('hornbutton')[0].firstChild;
        log("core", DEBUG, "getHornButton .. GOT Horn Button in common version");
    } catch (ex1) {
        try {
            O_hornButton = document.getElementsByClassName('mousehuntHud-huntersHorn-container')[0].firstChild;
            log("core", INFO, "getHornButton .. GOT Horn Button in NEWER version");
        } catch (ex2) {
            refresh("CANNOT get Horn Button");
        }
    }

    // other things
}


/*
 // Content Script to save data.
 chrome.extension.sendRequest({storage: 'foo', value: 'bar'});


 // Content Script to get data.
 chrome.extension.sendRequest({storage: 'foo'}, function(response) {
 console.log('foo => ' + response.storage);
 });

 */