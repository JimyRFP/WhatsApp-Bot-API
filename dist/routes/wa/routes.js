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
exports.router = void 0;
const session_1 = require("../../venom/session/session");
const process_1 = require("../../venom/process/process");
const start_1 = require("../../venom/start");
const process_2 = require("../../venom/process/process");
const process_3 = require("../../utils/so/process");
const response_1 = require("../../utils/response/response");
const text_1 = require("../../venom/text");
const serverpreconfigured_1 = require("serverpreconfigured");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["Waiting"] = "Waiting";
    ConnectionStatus["Connecting"] = "Connecting";
    ConnectionStatus["Connected"] = "Connected";
    ConnectionStatus["Disconnected"] = "Disconnected";
})(ConnectionStatus || (ConnectionStatus = {}));
;
var ClientMessageAction;
(function (ClientMessageAction) {
    ClientMessageAction["Auth"] = "Authenticate";
    ClientMessageAction["ConnectWA"] = "connect";
    ClientMessageAction["SendTextMessage"] = "send_text_message";
    ClientMessageAction["SendMassiveTextMessage"] = "send_massive_text_message";
    ClientMessageAction["SendAudioMessage"] = "send_audio_message";
    ClientMessageAction["SendMassiveAudioMessage"] = "send_massive_audio_message";
    ClientMessageAction["UpdatedContacts"] = "updated_contact";
    ClientMessageAction["Reconnect"] = "reconnect";
    ClientMessageAction["Logout"] = "logout";
    ClientMessageAction["CloseAndSave"] = "close_and_save";
    ClientMessageAction["Disconnect"] = "disconnect";
    ClientMessageAction["GetDeviceInfo"] = "get_device_info";
})(ClientMessageAction || (ClientMessageAction = {}));
;
var ServerMessageAction;
(function (ServerMessageAction) {
    ServerMessageAction["ActionRequired"] = "action_required";
    ServerMessageAction["AuthRequired"] = "auth_required";
    ServerMessageAction["AuthOK"] = "auth_ok";
    ServerMessageAction["AuthError"] = "auth_error";
    ServerMessageAction["UpdateQRCode"] = "updated_qr_code";
    ServerMessageAction["FatalError"] = "fatal_error";
    ServerMessageAction["Connecting"] = "connecting";
    ServerMessageAction["Connected"] = "connected";
    ServerMessageAction["WaitingConnectedStatus"] = "waiting_connected_status";
    ServerMessageAction["Processing"] = "processing";
    ServerMessageAction["InvalidAction"] = "invalid_action";
    ServerMessageAction["InvalidParams"] = "invalid_params";
    ServerMessageAction["ActionFailed"] = "action_failed";
    ServerMessageAction["ActionOK"] = "action_ok";
    ServerMessageAction["ClientDisconnected"] = "client_disconnected";
    ServerMessageAction["LogoutOK"] = "logout_ok";
    ServerMessageAction["LogoutError"] = "logout_error";
    ServerMessageAction["DeviceInfo"] = "device_info";
    ServerMessageAction["Disconected"] = "disconnected";
})(ServerMessageAction || (ServerMessageAction = {}));
var WSErrorCode;
(function (WSErrorCode) {
    WSErrorCode[WSErrorCode["NoError"] = 0] = "NoError";
    WSErrorCode[WSErrorCode["MustHaveMessageParam"] = 1] = "MustHaveMessageParam";
    WSErrorCode[WSErrorCode["InvalidWSToken"] = 2] = "InvalidWSToken";
    WSErrorCode[WSErrorCode["InvalidMessage"] = 3] = "InvalidMessage";
    WSErrorCode[WSErrorCode["KillProcessError"] = 4] = "KillProcessError";
    WSErrorCode[WSErrorCode["ConnectErrorFatal"] = 5] = "ConnectErrorFatal";
    WSErrorCode[WSErrorCode["ActionFail"] = 6] = "ActionFail";
})(WSErrorCode || (WSErrorCode = {}));
;
function router(dir, app) {
    app.ws(dir + '/wa_connect', (ws, req) => __awaiter(this, void 0, void 0, function* () {
        setConnectionStatus(ws, ConnectionStatus.Waiting);
        ws.on('message', (msg) => { wsOnMessage(ws, msg); });
    }));
}
exports.router = router;
function wsOnMessage(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield (0, serverpreconfigured_1.checkWSAuth)(ws, msg)))
            return;
        let m = {};
        try {
            m = JSON.parse(msg);
        }
        catch (e) {
            return responseError(ws, "Message must be JSON string", "");
        }
        if (!m.action)
            return responseOk(ws, ServerMessageAction.ActionRequired, "Must have 'action' param");
        yield checkClientIsConnected(ws);
        switch (m.action) {
            case ClientMessageAction.ConnectWA:
                return connectWA(ws, m);
            case ClientMessageAction.SendTextMessage:
                return sendTextMessageByWS(ws, m);
            case ClientMessageAction.SendMassiveTextMessage:
                return sendMassiveTextMessageByWS(ws, m);
            case ClientMessageAction.Reconnect:
                return reconnectClient(ws, m);
            case ClientMessageAction.Logout:
                return logoutClient(ws, m);
            case ClientMessageAction.CloseAndSave:
                return saveConnectAndCloseWS(ws, m);
            case ClientMessageAction.Auth:
                return responseOk(ws, ServerMessageAction.AuthOK);
            case ClientMessageAction.Disconnect:
                return disconnectSession(ws, m);
            case ClientMessageAction.GetDeviceInfo:
                return getDeviceInfo(ws);
        }
        return responseOk(ws, ServerMessageAction.InvalidAction, 'Unknown Action');
    });
}
function connectWA(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status != ConnectionStatus.Waiting)
            return responseOk(ws, ServerMessageAction.ActionFailed, "Connection Status Invalid Current: " + ws.connection_status);
        setConnectionStatus(ws, ConnectionStatus.Connecting);
        responseOk(ws, ServerMessageAction.Connecting, 'Waiting Connection');
        const sessionName = (0, session_1.getVenomSessionName)(ws.userId, 1);
        ws.sessionName = sessionName;
        try {
            yield (0, process_1.killProcessBySessionName)(sessionName);
        }
        catch (e) {
            return responseError(ws, ServerMessageAction.FatalError, "Error to close old session");
        }
        (0, start_1.startVenom)(sessionName, { logQR: false }, (client) => { venomOnConnected(ws, client); }, (e) => { venomOnError(ws, e); }, (data) => { venomOnQRCodeUpdate(ws, data); }, (data) => {
            venomBrowserInfo(sessionName, data);
        });
    });
}
function venomOnConnected(ws, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (global.venomserver_onconnected)
            global.venomserver_onconnected(client, ws);
        responseOk(ws, ServerMessageAction.Connected);
        setConnectionStatus(ws, ConnectionStatus.Connected);
        ws.venomClient = client;
        getDeviceInfo(ws);
    });
}
function getDeviceInfo(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status != ConnectionStatus.Connected)
            return responseOk(ws, ServerMessageAction.ActionFailed, "Must have connected status, current status: " + ws.connection_status);
        responseOk(ws, ServerMessageAction.Processing, "Getting Device Info");
        try {
            const info = yield ws.venomClient.getHostDevice();
            return responseOk(ws, ServerMessageAction.DeviceInfo, "", info);
        }
        catch (e) {
            return responseOk(ws, ServerMessageAction.ActionFailed, "Get Device Info Error");
        }
    });
}
function venomOnError(ws, error) {
    return __awaiter(this, void 0, void 0, function* () {
        responseError(ws, ServerMessageAction.FatalError, 'Error to connect', error);
        ws.terminate();
    });
}
function venomOnQRCodeUpdate(ws, data) {
    return __awaiter(this, void 0, void 0, function* () {
        responseOk(ws, ServerMessageAction.UpdateQRCode, '', data);
    });
}
function venomBrowserInfo(sessionName, data) {
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
function sendTextMessageByWS(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status != ConnectionStatus.Connected)
            return responseOk(ws, ServerMessageAction.ActionFailed, "Must have connected status, current status: " + ws.connection_status);
        if (!Boolean(msg.to) || !Boolean(msg.text))
            return responseOk(ws, ServerMessageAction.InvalidParams, "Must have parans 'to' and 'text'", msg);
        responseOk(ws, ServerMessageAction.Processing);
        (0, text_1.sendTextMessage)(ws.venomClient, msg.text, msg.to, onSend, onError);
        function onSend(result) {
            if (result.erro) {
                return responseOk(ws, ServerMessageAction.ActionFailed, result.text);
            }
            return responseOk(ws, ServerMessageAction.ActionOK, '', result);
        }
        function onError(error) {
            return responseOk(ws, ServerMessageAction.ActionFailed, 'Error', error);
        }
    });
}
function sendMassiveTextMessageByWS(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status != ConnectionStatus.Connected)
            return responseOk(ws, ServerMessageAction.ActionFailed, "Must have connected status, current status: " + ws.connection_status);
        if (!Boolean(msg.to) || !Boolean(msg.text))
            return responseOk(ws, ServerMessageAction.InvalidParams, "Must have parans 'to' and 'text'", msg);
        if (!Array.isArray(msg.to))
            return responseOk(ws, ServerMessageAction.InvalidParams, "'to' param must be array like 'to:[\"contact1\",\"contact2\"]'");
        responseOk(ws, ServerMessageAction.Processing);
        (0, text_1.sendMassiveTextMessage)(ws.venomClient, msg.text, msg.to, onEnd);
        function onEnd(data) {
            responseOk(ws, ServerMessageAction.ActionOK, "", { send: data.ok, error: data.error });
        }
    });
}
function responseOk(ws, message, errorMessage = '', data = {}) {
    ws.send((0, response_1.WSResponse)(true, message, errorMessage, data));
}
function responseError(ws, message, errorMessage, data = {}) {
    ws.send((0, response_1.WSResponse)(false, message, errorMessage, data));
    ws.terminate();
}
function checkClientIsConnected(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status == ConnectionStatus.Waiting || ws.connection_status == ConnectionStatus.Connecting)
            return;
        try {
            if (!(yield ws.venomClient.isConnected())) {
                setConnectionStatus(ws, ConnectionStatus.Disconnected);
                return responseOk(ws, ServerMessageAction.ClientDisconnected, "Check your phone connection, or reconnect");
            }
            setConnectionStatus(ws, ConnectionStatus.Connected);
        }
        catch (e) {
            setConnectionStatus(ws, ConnectionStatus.Disconnected);
            return responseOk(ws, ServerMessageAction.ClientDisconnected, "Check your phone connection, or reconnect");
        }
    });
}
function reconnectClient(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status == ConnectionStatus.Waiting || ws.connection_status == ConnectionStatus.Connecting)
            return responseOk(ws, ServerMessageAction.ActionFailed, "Connection status invalid to make this action current:" + ws.connection_status);
        try {
            console.log(yield ws.venomClient.restartService());
        }
        catch (e) {
            console.log(e);
        }
    });
}
function logoutClient(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status == ConnectionStatus.Waiting || ws.connection_status == ConnectionStatus.Connecting)
            return responseOk(ws, ServerMessageAction.ActionFailed, "Connection status invalid to make this action current:" + ws.connection_status);
        try {
            if (yield ws.venomClient.logout()) {
                responseOk(ws, ServerMessageAction.LogoutOK);
            }
            else {
                responseOk(ws, ServerMessageAction.LogoutError, 'Disconnect by your phone.');
            }
        }
        catch (e) {
            responseOk(ws, ServerMessageAction.LogoutError, 'Disconnect by your phone.');
        }
        ws.terminate();
    });
}
function saveConnectAndCloseWS(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status !== ConnectionStatus.Connected) {
            return responseOk(ws, ServerMessageAction.ActionFailed, "WS Not Connected");
        }
        try {
            ws.venomClient.close();
            responseOk(ws, ServerMessageAction.ActionOK, "OK");
            ws.terminate();
        }
        catch (e) {
            responseOk(ws, ServerMessageAction.ActionFailed, "I_E", e);
        }
    });
}
function disconnectSession(ws, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ws.connection_status !== ConnectionStatus.Connected) {
            return responseOk(ws, ServerMessageAction.ActionFailed, "WS Not Connected");
        }
        try {
            yield ws.venomClient.logout();
            setConnectionStatus(ws, ConnectionStatus.Waiting);
            return responseOk(ws, ServerMessageAction.Disconected, "Disconected");
        }
        catch (e) {
            return responseError(ws, ServerMessageAction.ActionFailed, "Disconnect error");
        }
    });
}
function setConnectionStatus(ws, status) {
    ws.connection_status = status;
}
