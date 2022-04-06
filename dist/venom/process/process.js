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
exports.killProcessBySessionName = exports.updateProcessDataBySessionName = exports.getProcessDataBySessionName = void 0;
const VenomSession_1 = require("../../database/models/VenomSession");
const process_1 = require("../../utils/so/process");
function getProcessDataBySessionName(sessionName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let r = yield VenomSession_1.VenomSession.findOne({ where: { session_name: sessionName } });
            return r;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getProcessDataBySessionName = getProcessDataBySessionName;
function updateProcessDataBySessionName(sessionName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let session = yield getProcessDataBySessionName(sessionName);
            if (session == null || session == undefined) {
                session = yield VenomSession_1.VenomSession.create({ session_name: sessionName, browser_pid: data.pid.toString() });
            }
            {
                session.browser_pid = data.pid.toString();
                yield session.save();
            }
            return session;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.updateProcessDataBySessionName = updateProcessDataBySessionName;
function killProcessBySessionName(sessionName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let s = yield getProcessDataBySessionName(sessionName);
            if (s == null || s == undefined) {
                return false;
            }
            else {
                return yield (0, process_1.killProcessByPid)(parseInt(s.browser_pid));
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.killProcessBySessionName = killProcessBySessionName;
