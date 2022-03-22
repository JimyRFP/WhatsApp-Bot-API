"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_ws_1 = __importDefault(require("express-ws"));
function initWebSocket(app) {
    return express_ws_1.default(app);
}
exports.initWebSocket = initWebSocket;
