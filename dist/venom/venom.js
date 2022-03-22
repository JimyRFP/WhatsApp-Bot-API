"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var venom = require('venom-bot');
function startVenom(sessionName, onConnected, onError, onQRCodeUpdate, browserInfo) {
    venom.create(sessionName, function (base64Qrimg, asciiQR, attempts, urlCode) {
        onQRCodeUpdate({ base64Qrimg: base64Qrimg, asciiQR: asciiQR, attempts: attempts, urlCode: urlCode });
    }, function (statusSession, session) {
    }, {
        logQR: false,
        disableSpins: true,
        disableWelcome: true,
        updateLogs: false,
        headless: true,
    }, undefined, function (browser, wsPage) {
        browserInfo(browser, wsPage);
    }).then(function (client) {
        onConnected(client);
    }).catch(function (error) {
        onError(error);
    });
}
exports.startVenom = startVenom;
