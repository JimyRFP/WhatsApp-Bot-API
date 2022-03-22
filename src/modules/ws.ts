import expressWs from "express-ws";
export function initWebSocket(app:any){
    return expressWs(app);
}
