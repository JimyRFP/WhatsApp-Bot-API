export interface venomClient{
    client:any,
    deviceInfo:any,
    sessionName:string,
}

declare global{
    var venomClients:Array<venomClient>;
    function venomserver_onconnected(venomClient:any,ws:any):any;  
}
export {}