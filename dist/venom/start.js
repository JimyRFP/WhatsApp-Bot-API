"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startVenom = void 0;
const venom = require('venom-bot');
function startVenom(sessionName, options = {}, onConnected, onError, onQRCodeUpdate, browserInfo) {
    venom.create(sessionName, (base64Qrimg, asciiQR, attempts, urlCode) => {
        if (onQRCodeUpdate == undefined)
            return;
        onQRCodeUpdate({ base64Qrimg: base64Qrimg, asciiQR: asciiQR, attempts: attempts, urlCode: urlCode });
    }, (statusSession, session) => {
    }, {
        logQR: options.logQR ? options.logQR : true,
        disableSpins: options.disableSpins ? options.disableSpins : true,
        disableWelcome: options.disableWelcome ? options.disableWelcome : true,
        updateLogs: options.updateLogs ? options.updateLogs : false,
        headless: options.headless ? options.headless : true,
    }, undefined, (browser, wsPage) => {
        if (browserInfo == undefined)
            return;
        browserInfo({ browser, wsPage });
    }).then((client) => {
        onConnected(client);
    }).catch((error) => {
        onError(error);
    });
}
exports.startVenom = startVenom;
