import { venomClient } from "../../types/index";
import { getHostDevice } from "../hostdevice";
export function getGlobalVenomClientBySessionName(sessionName:string):venomClient|false{
  if(!global.venomClients)
    return false;
  for(let i=0;i<global.venomClients.length;i++){
      if(global.venomClients[i].sessionName===sessionName)
         return global.venomClients[i];
  }  
  return false;
}
export function setGlobalVenomClient(sessionName:string,client:any):venomClient{
     let venomClient:venomClient={
        sessionName:sessionName,
        client:client,
        deviceInfo:false,
     };
     if(!global.venomClients)
         global.venomClients=[];
     for(let i=0;i<global.venomClients.length;i++){
         if(global.venomClients[i].sessionName===sessionName){
            global.venomClients[i]=venomClient;
            return global.venomClients[i];
         }
     } 
     global.venomClients.push(venomClient);  
     return venomClient;
}
export async function updateClientDeviceInfoBySessionName(sessionName:string):Promise<venomClient|false>{
   let venomClient=getGlobalVenomClientBySessionName(sessionName);
   if(!venomClient)
     return false;
  try{
     venomClient.deviceInfo=await venomClient.client.getHostDevice();
     return venomClient;
  }catch(e){
    throw e;
  }   
}