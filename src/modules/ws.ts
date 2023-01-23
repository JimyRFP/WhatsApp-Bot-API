import expressWs from "express-ws";
export function initWebSocket(app:any,server?:any):expressWs.Instance{
    return expressWs(app,server);
}
