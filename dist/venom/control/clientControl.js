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
exports.updateClientDeviceInfoBySessionName = exports.setGlobalVenomClient = exports.getGlobalVenomClientBySessionName = void 0;
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
