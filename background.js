
var DATA;
var requestTimeout = 1000 * 7;  // 7 seconds
var MHUrl = "https://www.mousehuntgame.com";
var MHGame = "mousehuntgame.com";
var MHGameFilter = { url: [{urlContains: MHGame}] };

// Listener Managers
chrome.browserAction.onClicked.addListener(gotoMHGameTab);
chrome.webNavigation.onDOMContentLoaded.addListener(onMHDOMContentLoaded, MHGameFilter);

function onMHDOMContentLoaded() {
    // register and wait for process

    updateUserData(function(user_id) {
        sendNotification("/images/cheeseOn32.png",
            "onCompleted: " + user_id,
            "Name: " + DATA.user.username,
            3000);
        localStorage.MH_user_id = user_id;
        updateBrowserActionIcon(true);

    }, function() {
        sendNotification("/images/cheeseOff32.png",
            "onCompleted",
            "NO USER. Login!",
            3000);
        localStorage.removeItem(MH_user_id); 
        updateBrowserActionIcon(false);
    });
}


function isMHGamelUrl(url) {
    // Return whether if the URL starts with the MHGame prefix.
    return url.indexOf(MHGame) > 0;
}

function gotoMHGameTab() {
    console.log('Going to mousehuntgame ...');
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i<tabs.length;  i++) {
            tab = tabs[i];
            if (tab.url && isMHGamelUrl(tab.url)) {
                console.log('Found MHGame tab: ' + tab.url + '. ' +
                    'Focusing and refreshing user data ...');
                chrome.tabs.update(tab.id, { selected: true });
                onMHDOMContentLoaded();
                return;
            }
        }

        console.log('Could not find MHGame tab. Creating one...');
        chrome.tabs.create({ url: MHUrl });
    });
}

function updateBrowserActionIcon(isLogined) {
    if (isLogined) {
        chrome.browserAction.setIcon({path: "/images/cheeseOn32.png"});
        chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]}); // Red
        chrome.browserAction.setBadgeText({text:"19:25"});
    } else {
        chrome.browserAction.setIcon({path:"/images/cheeseOff32.png"});
        chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]}); // Gray
        chrome.browserAction.setBadgeText({text:"?"});
    }
}

function updateUserData(onSuccessUserData, onErrorUserData) {
    var xhr = new XMLHttpRequest();
    var url = MHUrl + "/managers/ajax/abtest.php";
    var abortTimerId = window.setTimeout(
        function() {
            xhr.abort();
        },
        requestTimeout);

    function handleSuccess(user_id) {
        localStorage.requestFailureCount = 0;
        window.clearTimeout(abortTimerId);
        if (onSuccessUserData)
            onSuccessUserData(user_id);
    }

    var invokedErrorCallback = false;
    function handleError() {
        localStorage.requestFailureCount ++;
        window.clearTimeout(abortTimerId);
        if (onErrorUserData && !invokedErrorCallback)
            onErrorUserData();
        invokedErrorCallback = true;
    }

    try {
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4)
                return;

            if (xhr.status != 200)
                return;

            if (xhr.responseText) {
                var textJSON = xhr.responseText;
                DATA = JSON.parse(textJSON, null);
                try {
                    handleSuccess(DATA.user.user_id);
                    return;
                } catch (ex) {
                    handleError();
                    return;
                }
            }
            handleError();
        };

        xhr.onerror = function(error) {
            handleError();
        };

        xhr.open("GET", url, true);
        xhr.send(null);
    } catch(e) {
        console.error(e);
        handleError();
    }
}