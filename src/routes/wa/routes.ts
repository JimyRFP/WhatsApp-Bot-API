import { getVenomSessionName } from "../../venom/session/session";
import { killSessionAndStartVenomSafe } from "../../venom/start";
import { WSResponse } from "../../utils/response/response";
import {sendTextMessage,sendMassiveTextMessage} from "../../venom/text";
import { checkWSAuth } from "serverpreconfigured";
import { setGlobalVenomClient } from "../../venom/control/clientControl";
import { baseServer } from "../..";
const DEBUG=true;
const debugMessage=baseServer.debugMessage;
enum ConnectionStatus{
    "Waiting"='Waiting',
    'Connecting'='Connecting',
    'Connected'='Connected',
    'Disconnected'='Disconnected',
};
enum ClientMessageAction{
    Auth="Authenticate",
    ConnectWA="connect",
    SendTextMessage='send_text_message',
    SendMassiveTextMessage='send_massive_text_message',
    SendAudioMessage='send_audio_message',
    SendMassiveAudioMessage='send_massive_audio_message',
    UpdatedContacts='updated_contact', 
    Reconnect='reconnect',   
    Logout='logout',
    CloseAndSave='close_and_save',
    Disconnect='disconnect',
    GetDeviceInfo='get_device_info',
    Ping='ping',
};
enum ServerMessageAction{
    ActionRequired='action_required',
    AuthRequired='auth_required',
    AuthOK='auth_ok',
    AuthError='auth_error',
    UpdateQRCode="updated_qr_code",
    FatalError='fatal_error',
    Connecting='connecting',
    Connected='connected',
    WaitingConnectedStatus='waiting_connected_status',
    Processing='processing',
    InvalidAction='invalid_action',
    InvalidParams='invalid_params',
    ActionFailed='action_failed',
    ActionOK='action_ok',
    ClientDisconnected='client_disconnected',
    LogoutOK='logout_ok',
    LogoutError='logout_error',
    DeviceInfo='device_info',
    Disconected='disconnected',
    
}
enum WSErrorCode{
    NoError=0,
    MustHaveMessageParam,
    InvalidWSToken,
    InvalidMessage,
    KillProcessError,
    ConnectErrorFatal,
    ActionFail,
};

export function router(dir:string,app:any,venomOptions:any={}){
        app.ws(dir+'/wa_connect',async (ws:any,req:any)=>{
            ws.venomOptions=venomOptions;
            debugMessage(DEBUG,
                        "Start venom websocket connection",
                        {data:{message:"venomOptions",venomOptions}});
            setConnectionStatus(ws,ConnectionStatus.Waiting);
            ws.on('message',(msg:any)=>{wsOnMessage(ws,msg)});
        });
}        

async function wsOnMessage(ws:any,msg:any){
    if(!(await checkWSAuth(ws,msg)))
      return;
    let m:any={};  
    try{  
       m=JSON.parse(msg);
    }catch(e){
       return responseError(ws,"Message must be JSON string","");
    }
    if(!m.action)
      return responseOk(ws,ServerMessageAction.ActionRequired,"Must have 'action' param");
        switch(m.action){
            case ClientMessageAction.ConnectWA:
               return connectWA(ws,m);  
            case ClientMessageAction.SendTextMessage:
               return sendTextMessageByWS(ws,m);  
            case ClientMessageAction.SendMassiveTextMessage:
               return sendMassiveTextMessageByWS(ws,m);    
            case ClientMessageAction.Reconnect:
               return reconnectClient(ws,m);       
            case ClientMessageAction.Logout:
               return logoutClient(ws,m);
            case ClientMessageAction.CloseAndSave:
                return saveConnectAndCloseWS(ws,m);    
            case ClientMessageAction.Auth:
               return responseOk(ws,ServerMessageAction.AuthOK);     
            case ClientMessageAction.Disconnect:
               return disconnectSession(ws,m);  
            case ClientMessageAction.GetDeviceInfo:
               return getDeviceInfo(ws);      
            case ClientMessageAction.Ping:
               return responseOk(ws,ServerMessageAction.ActionOK);    
                 
                 
        }
    return responseOk(ws,ServerMessageAction.InvalidAction,'Unknown Action');
}

async function connectWA(ws:any,msg:any){ 
   if(ws.connection_status!=ConnectionStatus.Waiting)
      return responseOk(ws,ServerMessageAction.ActionFailed,"Connection Status Invalid Current: "+ws.connection_status);
   setConnectionStatus(ws,ConnectionStatus.Connecting);
   responseOk(ws,ServerMessageAction.Connecting,'Waiting Connection');
   const sessionName=getVenomSessionName(ws.userId,1);
   ws.sessionName=sessionName;
   try{
     await killSessionAndStartVenomSafe(sessionName,ws.venomOptions,
                                       (client:any)=>{venomOnConnected(ws,client)},
                                       (e:any)=>{venomOnError(ws,e)},
                                       (data:any)=>{venomOnQRCodeUpdate(ws,data)});                        
     
   }catch(e){
      debugMessage(DEBUG,"Connet venom error",{data:{error:e}})
      return responseError(ws,ServerMessageAction.FatalError,"Error to close old session");
   }
   

}

async function venomOnConnected(ws:any,client:any){
    debugMessage(DEBUG,"Connect Venom OK");
    setGlobalVenomClient(ws.sessionName,client);
    ws.venomClient=client;   
    setConnectionStatus(ws,ConnectionStatus.Connected);
    responseOk(ws,ServerMessageAction.Connected);        
}
async function getDeviceInfo(ws:any) {
    if(ws.connection_status!=ConnectionStatus.Connected)
         return responseOk(ws,ServerMessageAction.ActionFailed,"Must have connected status, current status: "+ws.connection_status);
    responseOk(ws,ServerMessageAction.Processing,"Getting Device Info");
    try{
        let info=await ws.venomClient.getHostDevice(); 
        if(!info.id){
            info=await ws.venomClient.getHostDeviceFast();
        }
        return responseOk(ws,ServerMessageAction.DeviceInfo,"",info);
     }catch(e){
        return responseOk(ws,ServerMessageAction.ActionFailed,"Get Device Info Error");
     }
}

async function venomOnError(ws:any,error:any){
   responseError(ws,ServerMessageAction.FatalError,'Error to connect',error); 
   ws.terminate();
}
async function venomOnQRCodeUpdate(ws:any,data:any){
   responseOk(ws,ServerMessageAction.UpdateQRCode,'',data);
}

async function sendTextMessageByWS(ws:any,msg:any) {
    if(ws.connection_status!=ConnectionStatus.Connected)
      return responseOk(ws,ServerMessageAction.ActionFailed,"Must have connected status, current status: "+ws.connection_status);
    if(!Boolean(msg.to) || !Boolean(msg.text))
      return responseOk(ws,ServerMessageAction.InvalidParams,"Must have parans 'to' and 'text'",msg);
    responseOk(ws,ServerMessageAction.Processing);
    sendTextMessage(ws.venomClient,msg.text,msg.to,onSend,onError);
    function onSend(result:any){
        if(result.erro){
            return responseOk(ws,ServerMessageAction.ActionFailed,result.text);
        }
        return responseOk(ws,ServerMessageAction.ActionOK,'',result);
    }
    function onError(error:any){
        return responseOk(ws,ServerMessageAction.ActionFailed,'Error',error);
    }
}

async function sendMassiveTextMessageByWS(ws:any,msg:any){
    if(ws.connection_status!=ConnectionStatus.Connected)
      return responseOk(ws,ServerMessageAction.ActionFailed,"Must have connected status, current status: "+ws.connection_status);
    if(!Boolean(msg.to) || !Boolean(msg.text))
      return responseOk(ws,ServerMessageAction.InvalidParams,"Must have parans 'to' and 'text'",msg);
    if(!Array.isArray(msg.to))
      return responseOk(ws,ServerMessageAction.InvalidParams,"'to' param must be array like 'to:[\"contact1\",\"contact2\"]'");
    responseOk(ws,ServerMessageAction.Processing);
    sendMassiveTextMessage(ws.venomClient,msg.text,msg.to,onEnd);
    function onEnd(data:{ok:any,error:any}){
       responseOk(ws,ServerMessageAction.ActionOK,"",{send:data.ok,error:data.error});
    }  
}


function responseOk(ws:any,message:string,errorMessage:string='',data:any={}){
   ws.send(WSResponse(true,message,errorMessage,data));
}
function responseError(ws:any,message:string,errorMessage:string,data:any={}){
  ws.send(WSResponse(false,message,errorMessage,data));
  ws.terminate();
}


async function reconnectClient(ws:any,msg:any){
    if(ws.connection_status==ConnectionStatus.Waiting || ws.connection_status==ConnectionStatus.Connecting)
       return responseOk(ws,ServerMessageAction.ActionFailed,"Connection status invalid to make this action current:"+ws.connection_status);
    try{
        console.log(await ws.venomClient.restartService());
    }catch(e){
        console.log(e);
    }    
}
async function logoutClient(ws:any,msg:any){
    if(ws.connection_status==ConnectionStatus.Waiting || ws.connection_status==ConnectionStatus.Connecting)
       return responseOk(ws,ServerMessageAction.ActionFailed,"Connection status invalid to make this action current:"+ws.connection_status);
    try{
        if(await ws.venomClient.logout()){
            responseOk(ws,ServerMessageAction.LogoutOK);
        }else{
            responseOk(ws,ServerMessageAction.LogoutError,'Disconnect by your phone.');
        }
    }catch(e){
        responseOk(ws,ServerMessageAction.LogoutError,'Disconnect by your phone.');
    }   
    ws.terminate();
}
async function saveConnectAndCloseWS(ws:any,msg:any){
    if(ws.connection_status!==ConnectionStatus.Connected){
        return responseOk(ws,ServerMessageAction.ActionFailed,"WS Not Connected");
    }
    try{
      ws.venomClient.close();
      responseOk(ws,ServerMessageAction.ActionOK,"OK");
      ws.terminate();
    }catch(e){
      responseOk(ws,ServerMessageAction.ActionFailed,"I_E",e);
    }
}
async function disconnectSession(ws:any,msg:any){
    if(ws.connection_status!==ConnectionStatus.Connected){
        return responseOk(ws,ServerMessageAction.ActionFailed,"WS Not Connected");
    }
    try{
       await ws.venomClient.logout();
       setConnectionStatus(ws,ConnectionStatus.Waiting);
       return responseOk(ws,ServerMessageAction.Disconected,"Disconected");
    }catch(e){
       return responseError(ws,ServerMessageAction.ActionFailed,"Disconnect error");

    }
}
function setConnectionStatus(ws:any,status:ConnectionStatus){
   debugMessage(DEBUG,"Set connection Statys",{data:{status}}) 
   ws.connection_status=status;
}




