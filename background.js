var MHUrl = "https://www.mousehuntgame.com";
var MHGame = "mousehuntgame.com";

// Listener Managers
chrome.browserAction.onClicked.addListener(gotoMHGameTab);

function gotoMHGameTab() {
    //console.log('Going to mousehuntgame tab if it is opened');
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i<tabs.length;  i++) {
            var tab = tabs[i];
            if ( tab.url && (tab.url.indexOf(MHGame)>0) ) {
                //console.log('Found MHGame tab: ' + tab.url + '. ' +
                //    'Focusing and refreshing user data ...');
                chrome.tabs.update(tab.id, { selected: true });
                //onMHDOMContentLoaded();
                return;
            }
        }

        //console.log('Could not find MHGame tab. Creating one...');
        chrome.tabs.create({ url: MHUrl });
    });
}
