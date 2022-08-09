export interface venomClient{
    client:any,
    deviceInfo:any,
    removeOnMessage:false|any,
    sessionName:string,
}

declare global{
    var venomClients:Array<venomClient>;
    function venomserver_onconnected(venomClient:any,ws:any):any;  
}
export {}