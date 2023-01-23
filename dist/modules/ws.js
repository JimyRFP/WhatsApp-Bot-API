"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = void 0;
const express_ws_1 = __importDefault(require("express-ws"));
function initWebSocket(app, server) {
    return (0, express_ws_1.default)(app, server);
}
exports.initWebSocket = initWebSocket;
