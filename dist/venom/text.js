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
exports.sendMassiveTextMessage = exports.sendTextMessage = void 0;
function sendTextMessage(client, message, to, onSend = null, onError = null) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield client.sendText(to, message);
            if (onSend)
                onSend(result);
            return result;
        }
        catch (e) {
            if (onError)
                onError(e);
            return false;
        }
    });
}
exports.sendTextMessage = sendTextMessage;
function sendMassiveTextMessage(client, message, to, onEnd = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let result_ok = [];
        let result_error = [];
        if (!Array.isArray(to))
            throw "to param must be array";
        for (let i = 0; i < to.length; i++) {
            try {
                let r = yield client.sendText(to[i], message);
                result_ok.push({ to_index: i, result: r });
            }
            catch (e) {
                result_error.push({ to_index: i, error: e });
            }
        }
        let ret = { ok: result_ok, error: result_error };
        if (onEnd)
            onEnd(ret);
        return ret;
    });
}
exports.sendMassiveTextMessage = sendMassiveTextMessage;
