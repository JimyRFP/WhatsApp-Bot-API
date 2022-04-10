"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenomBotServer = void 0;
const serverpreconfigured_1 = __importDefault(require("serverpreconfigured"));
const ws_1 = require("./modules/ws");
const routes_1 = require("./routes/wa/routes");
class VenomBotServer {
    constructor(options = {}) {
        this._userAuthRouteUrl = options.userAuthRouteUrl ? options.userAuthRouteUrl : '/user';
        this._wsAuthRouteUrl = options.wsAuthRouteUrl ? options.wsAuthRouteUrl : '/wsauth';
        this._whatsAppWSRouteUrl = options.whatsAppWSRouteUrl ? options.whatsAppWSRouteUrl : '/wa';
        this._expressServer = new serverpreconfigured_1.default();
        this._expressServer.initAuthSystem(this._userAuthRouteUrl);
        this._expressServer.initWSAuthSystem(this._wsAuthRouteUrl);
        this._app = this._expressServer.getApp();
        this._wsInstance = (0, ws_1.initWebSocket)(this._app);
        (0, routes_1.router)(this._whatsAppWSRouteUrl, this._app);
    }
    listen(port) {
        this._expressServer.listen(port);
    }
    getApp() {
        return this._expressServer.getApp();
    }
}
exports.VenomBotServer = VenomBotServer;
