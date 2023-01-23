import ExpressServer from "serverpreconfigured";
import expressWs from "express-ws";
import { Express } from "express";
export declare class VenomBotServer {
    _userAuthRouteUrl: string;
    _wsAuthRouteUrl: string;
    _whatsAppWSRouteUrl: string;
    _expressServer: ExpressServer;
    _app: Express;
    _wsInstance: expressWs.Instance;
    _whatsAppActionsUrl: string;
    constructor(options?: any);
    listen(port?: number): void;
    getApp(): Express;
}
