/**
 * Created by nnt on 01-12-2014.
 */


var MHUrl = "https://www.mousehuntgame.com";
var MHGame = "mousehuntgame.com";

// Listener Managers
chrome.browserAction.onClicked.addListener(gotoMHGameTab);

function gotoMHGameTab() {
    log('background', DEBUG, 'Go to mousehuntgame tab if it is opened');
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i<tabs.length;  i++) {
            var tab = tabs[i];
            if ( tab.url && (tab.url.indexOf(MHGame)>0) ) {
                log('background', DEBUG, 'Found MHGame tab: ' + tab.url + '. ' +
                    'Focusing and refreshing user data ...');
                chrome.tabs.update(tab.id, { selected: true });

                return;
            }
        }

        log('background', INFO, 'There is NO mousehuntgame tab .. create one');
        chrome.tabs.create({ url: MHUrl });
    });
}

