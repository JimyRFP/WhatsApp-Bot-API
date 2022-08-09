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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconnectClientBySession = exports.destroySession = exports.updateClientDeviceInfoBySessionName = exports.setGlobalVenomClient = exports.getGlobalVenomClientBySessionName = void 0;
const process_1 = require("../process/process");
const path_1 = __importDefault(require("path"));
const removedir_1 = require("../../utils/so/removedir");
const start_1 = require("../start");
function getGlobalVenomClientBySessionName(sessionName) {
    if (!global.venomClients)
        return false;
    for (let i = 0; i < global.venomClients.length; i++) {
        if (global.venomClients[i].sessionName === sessionName)
            return global.venomClients[i];
    }
    return false;
}
exports.getGlobalVenomClientBySessionName = getGlobalVenomClientBySessionName;
function setGlobalVenomClient(sessionName, client) {
    let venomClient = {
        sessionName: sessionName,
        client: client,
        removeOnMessage: false,
        deviceInfo: false,
    };
    if (!global.venomClients)
        global.venomClients = [];
    for (let i = 0; i < global.venomClients.length; i++) {
        if (global.venomClients[i].sessionName === sessionName) {
            global.venomClients[i] = venomClient;
            return global.venomClients[i];
        }
    }
    global.venomClients.push(venomClient);
    return venomClient;
}
exports.setGlobalVenomClient = setGlobalVenomClient;
function updateClientDeviceInfoBySessionName(sessionName) {
    return __awaiter(this, void 0, void 0, function* () {
        let venomClient = getGlobalVenomClientBySessionName(sessionName);
        if (!venomClient)
            return false;
        try {
            venomClient.deviceInfo = yield venomClient.client.getHostDevice();
            return venomClient;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.updateClientDeviceInfoBySessionName = updateClientDeviceInfoBySessionName;
function destroySession(sessionName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!global.venomClients)
            return false;
        let newClients = [];
        let removeClient = null;
        for (let i = 0; i < global.venomClients.length; i++) {
            if (global.venomClients[i].sessionName === sessionName) {
                removeClient = global.venomClients[i];
                continue;
            }
            newClients.push(global.venomClients[i]);
        }
        global.venomClients = newClients;
        try {
            if (removeClient)
                yield removeClient.client.logout();
        }
        catch (e) {
        }
        try {
            yield (0, process_1.killProcessBySessionName)(sessionName);
            yield (0, removedir_1.removeDir)(path_1.default.join(process.cwd(), 'tokens', sessionName));
        }
        catch (e) {
            throw e;
        }
    });
}
exports.destroySession = destroySession;
function reconnectClientBySession(sessionName, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                (0, start_1.killSessionAndStartVenom)(sessionName, options, onConnected, onError, onQRCodeUpdate, (data) => (0, start_1.updateBrowserInfo)(sessionName, data));
            }
            catch (e) {
                throw reject(e);
            }
            function onConnected(client) {
                let venomClient = setGlobalVenomClient(sessionName, client);
                resolve(venomClient);
            }
            function onError(error) {
                reject(error);
            }
            function onQRCodeUpdate(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield (0, process_1.killProcessBySessionName)(sessionName);
                        reject("Need Scan QRCode");
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
        });
    });
}
exports.reconnectClientBySession = reconnectClientBySession;
