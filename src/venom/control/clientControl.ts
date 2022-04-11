import { venomClient } from "../../types/index";
import { getHostDevice } from "../hostdevice";
import { killProcessBySessionName } from "../process/process";
import path from 'path';
import { removeDir } from "../../utils/so/removedir";
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
export async function destroySession(sessionName:string){
      if(!global.venomClients)
      return false;
      let newClients=[];
      let removeClient=null;
      for(let i=0;i<global.venomClients.length;i++){
         if(global.venomClients[i].sessionName===sessionName){
            removeClient=global.venomClients[i];
            continue;
         }
         newClients.push(global.venomClients[i]);            
      }
      global.venomClients=newClients;
      if(!removeClient)
         return;
      try{
         removeClient.client.logout();
      }catch(e){
      }
      try{
         await killProcessBySessionName(sessionName);
         await removeDir(path.join(process.cwd(),'tokens',sessionName));
      }catch(e){
         throw e;
      }
}