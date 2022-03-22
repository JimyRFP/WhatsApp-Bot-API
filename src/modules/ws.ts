import expressWs from "express-ws";
export function initWebSocket(app:any):expressWs.Instance{
    return expressWs(app);
}
