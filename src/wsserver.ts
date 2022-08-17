import ExpressServer from "serverpreconfigured";
import { initWebSocket } from "./modules/ws";
import { router as whatsAppWSRouter } from "./routes/wa/routes";
import expressWs from "express-ws";
import { router as routerActions } from "./routes/actions";
import { setUserDataMiddleware } from "serverpreconfigured";
export class VenomBotServer{
    _userAuthRouteUrl:string;
    _wsAuthRouteUrl:string;
    _whatsAppWSRouteUrl:string;
    _expressServer:ExpressServer;
    _app:any;
    _wsInstance:expressWs.Instance;
    _whatsAppActionsUrl:string;
    constructor(options:any={}){ 
       this._userAuthRouteUrl=options.userAuthRouteUrl?options.userAuthRouteUrl:'/user';
       this._wsAuthRouteUrl=options.wsAuthRouteUrl?options.wsAuthRouteUrl:'/wsauth';
       this._whatsAppWSRouteUrl=options.whatsAppWSRouteUrl?options.whatsAppWSRouteUrl:'/wa';
       this._whatsAppActionsUrl=options.whatsAppActionsUrl?options.whatsAppActionsUrl:'/actions';
       this._expressServer=new ExpressServer();
       this._expressServer.initAuthSystem(this._userAuthRouteUrl);
       this._expressServer.initWSAuthSystem(this._wsAuthRouteUrl);
       this._app=this._expressServer.getApp();
       this._wsInstance=initWebSocket(this._app);
       this._app.use(this._whatsAppActionsUrl,setUserDataMiddleware,routerActions);
       whatsAppWSRouter(this._whatsAppWSRouteUrl,this._app,options.venomOptions||{});
    }
    listen(port?:number){
       this._expressServer.listen(port);
    }
    getApp(){
       return this._expressServer.getApp();
    }
}