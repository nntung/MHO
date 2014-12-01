/**
 * Created by nnt on 01-12-2014.
 */


var MHUrl = "https://www.mousehuntgame.com";
var MHGame = "mousehuntgame.com";

// Listener Managers
chrome.browserAction.onClicked.addListener(gotoMHGameTab);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.storage) {
        if (typeof request.value != 'undefined') {
            localStorage[request.storage] = request.value;
        }
        sendResponse({storage: localStorage[request.storage]});
    } else {
        sendResponse({});
    }
});

function gotoMHGameTab() {
    log('background', DEBUG, 'Go to mousehuntgame tab if it is opened');
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i<tabs.length;  i++) {
            var tab = tabs[i];
            if ( tab.url && (tab.url.indexOf(MHGame)>0) ) {
                log('background', DEBUG, 'Found MHGame tab: ' + tab.url + '. ' +
                    'Focusing and refreshing user data ...');
                chrome.tabs.update(tab.id, { selected: true });
                updateBrowserActionView();
                return;
            }
        }

        log('background', INFO, 'There is NO mousehuntgame tab .. create one');
        chrome.tabs.create({ url: MHUrl });
    });
}

function updateBrowserActionView() {
    var gameStatus = localStorage.MHO_login;

    if (gameStatus == 'yes') {
        chrome.browserAction.setIcon({path: "/images/cheese32on.png"});
        chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]}); // Red
        chrome.browserAction.setBadgeText({text:"19:25"});
    } else {
        chrome.browserAction.setIcon({path:"/images/cheese32off.png"});
        chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]}); // Gray
        chrome.browserAction.setBadgeText({text:"?"});
    }
}