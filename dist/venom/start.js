"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBrowserInfo = exports.killSessionAndStartVenomSafe = exports.killSessionAndStartVenom = exports.startVenom = void 0;
const venom = require('venom-bot-updated');
const process_1 = require("./process/process");
const process_2 = require("./process/process");
const process_3 = require("../utils/so/process");
function startVenom(sessionName, options = {}, onConnected, onError, onQRCodeUpdate, browserInfo) {
    const useOptions = getOptions();
    venom.create(sessionName, (base64Qrimg, asciiQR, attempts, urlCode) => {
        if (onQRCodeUpdate == undefined)
            return;
        onQRCodeUpdate({ base64Qrimg: base64Qrimg, asciiQR: asciiQR, attempts: attempts, urlCode: urlCode });
    }, (statusSession, session) => {
    }, useOptions, undefined, (browser, wsPage) => {
        if (browserInfo == undefined)
            return;
        browserInfo({ browser, wsPage });
    }).then((client) => {
        onConnected(client);
    }).catch((error) => {
        onError(error);
    });
    function getOptions() {
        const defaultOptions = {
            logQR: false,
            disableSpins: true,
            disableWelcome: true,
            updateLogs: false,
            headless: true,
            multidevice: true,
        };
        let useOptions = options || {};
        for (var [key, value] of Object.entries(defaultOptions)) {
            if (options[key] == undefined) {
                useOptions[key] = value;
            }
        }
        return useOptions;
    }
}
exports.startVenom = startVenom;
function killSessionAndStartVenom(sessionName, options = {}, onConnected, onError, onQRCodeUpdate, browserInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, process_1.killProcessBySessionName)(sessionName);
        }
        catch (e) {
            throw e;
        }
        startVenom(sessionName, options, onConnected, onError, onQRCodeUpdate, browserInfo);
    });
}
exports.killSessionAndStartVenom = killSessionAndStartVenom;
function killSessionAndStartVenomSafe(sessionName, options = {}, onConnected, onError, onQRCodeUpdate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, process_1.killProcessBySessionName)(sessionName);
        }
        catch (e) {
            throw e;
        }
        startVenom(sessionName, options, onConnected, onError, onQRCodeUpdate, (data) => { updateBrowserInfo(sessionName, data); });
    });
}
exports.killSessionAndStartVenomSafe = killSessionAndStartVenomSafe;
function updateBrowserInfo(sessionName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const pid = data.browser.process().pid;
        try {
            yield (0, process_2.updateProcessDataBySessionName)(sessionName, { pid });
        }
        catch (e) {
            (0, process_3.killProcessByPid)(pid);
        }
    });
}
exports.updateBrowserInfo = updateBrowserInfo;
