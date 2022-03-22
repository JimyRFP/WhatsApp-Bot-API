import ExpressServer from "serverpreconfigured";
import expressWs from "express-ws";
export declare class WhatsAppBotServer {
    _userAuthRouteUrl: string;
    _wsAuthRouteUrl: string;
    _whatsAppWSRouteUrl: string;
    _expressServer: ExpressServer;
    _app: any;
    _wsInstance: expressWs.Instance;
    constructor(options?: any);
    listen(port?: number): void;
}
