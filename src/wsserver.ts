import ExpressServer from "serverpreconfigured";
import { initWebSocket } from "./modules/ws";
import { router as whatsAppWSRouter } from "./routes/wa/routes";
import expressWs from "express-ws";
export class WhatsAppBotServer{
    _userAuthRouteUrl:string;
    _wsAuthRouteUrl:string;
    _whatsAppWSRouteUrl:string;
    _expressServer:ExpressServer;
    _app:any;
    _wsInstance:expressWs.Instance;
    constructor(options:any={}){ 
       this._userAuthRouteUrl=options.userAuthRouteUrl?options.userAuthRouteUrl:'/user';
       this._wsAuthRouteUrl=options.wsAuthRouteUrl?options.wsAuthRouteUrl:'/wsauth';
       this._whatsAppWSRouteUrl=options.whatsAppWSRouteUrl?options.whatsAppWSRouteUrl:'/wa';
       this._expressServer=new ExpressServer();
       this._expressServer.initAuthSystem(this._userAuthRouteUrl);
       this._expressServer.initWSAuthSystem(this._wsAuthRouteUrl);
       this._app=this._expressServer.getApp();
       this._wsInstance=initWebSocket(this._app);
       whatsAppWSRouter(this._whatsAppWSRouteUrl,this._app);
    }
    listen(port?:number){
       this._expressServer.listen(port);
    }
}