/**
 * Created by nnt on 01-12-2014.
 */

/**
 * Log level definition
 */
var FATAL = 1;
var ERROR = 2;
var WARNING = 3;
var INFO = 4;
var DEBUG = 5;
var TRACE = 6;

/**
 * Log configuration
 */
var tags = [
    {
        tag: 'background',
        level: TRACE
    },
    {
        tag: 'core',
        level: TRACE
    }
];

/**
 * Log method
 */
function log(tag, level, message) {
    // look up tag level
    var levelTag = 0;
    for (var i = 0; i < tags.length; ++i) {
        if (tag == tags[i].tag) {
            levelTag = tags[i].level;
            break;
        }
    }

    var datetime = new Date();

    if (level <= levelTag) {
        switch (level) {
            case TRACE:
                console.log("MHO " + datetime + " [Trace]: " + tag + " -> " + message);
                break;
            case DEBUG:
                console.log("MHO " + datetime + " [Debug]: " + tag + " -> " + message);
                break;
            case INFO:
                console.log("MHO " + datetime + " [Info]: " + tag + " -> " + message);
                break;
            case WARNING:
                console.log("MHO " + datetime + " [Warning]: " + tag + " -> " + message);
                break;
            case ERROR:
                console.log("MHO " + datetime + " [Error]: " + tag + " -> " + message);
                break;
            case FATAL:
                console.log("MHO " + datetime + " [Fatal]: " + tag + " -> " + message);
                break;
        }
    }

}