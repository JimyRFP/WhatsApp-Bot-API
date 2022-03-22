"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverpreconfigured_1 = __importDefault(require("serverpreconfigured"));
const ws_1 = require("./modules/ws");
const routes_1 = require("./routes/wa/routes");
const server = new serverpreconfigured_1.default();
const app = server.getApp();
server.initAuthSystem();
server.initWSAuthSystem();
exports.wsInstace = ws_1.initWebSocket(app);
routes_1.router('/ws', app);
server.listen(3069);
