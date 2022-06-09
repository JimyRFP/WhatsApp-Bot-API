const venom=require('venom-bot');
import { killProcessBySessionName } from "./process/process";
import { updateProcessDataBySessionName } from "./process/process";
import { killProcessByPid } from "../utils/so/process";
export function startVenom(sessionName:string,options:any={},onConnected:any,onError:any,onQRCodeUpdate:any,browserInfo:any){
  const useOptions=getOptions();
  console.log(useOptions);
  venom.create(
      sessionName,
      (base64Qrimg:any, asciiQR:any, attempts:any, urlCode:any) => {
        if(onQRCodeUpdate==undefined)
          return;
        onQRCodeUpdate({base64Qrimg:base64Qrimg,asciiQR:asciiQR,attempts:attempts,urlCode:urlCode});
      },
      (statusSession:any, session:any) => {

      },
      useOptions
      ,
      undefined,
      (browser:any,wsPage:any)=>{
        if(browserInfo==undefined)
          return;
        browserInfo({browser,wsPage});
      }
      
  ).then((client:any)=>{
    onConnected(client);
  }).catch((error:any)=>{
     onError(error);
  });
  function getOptions():any{
     const defaultOptions={
        logQR:false,
        disableSpins:true,
        disableWelcome:true,
        updateLogs:false,
        headless:true,
     };
     let useOptions=options||{};
     for (var [key, value] of Object.entries(defaultOptions)) {
         if(options[key]==undefined){
            useOptions[key]=value;
         } 
     }  
     return useOptions;
  }
}

export async function killSessionAndStartVenom(sessionName:string,options:any={},onConnected:any,onError:any,onQRCodeUpdate:any,browserInfo:any){
    try{
       await killProcessBySessionName(sessionName);
    }catch(e){
       throw e;
    }
    startVenom(sessionName,options,onConnected,onError,onQRCodeUpdate,browserInfo);
}

export async function killSessionAndStartVenomSafe(sessionName:string,options:any={},onConnected:any,onError:any,onQRCodeUpdate:any){
  try{
     await killProcessBySessionName(sessionName);
  }catch(e){
     throw e;
  }
  startVenom(sessionName,options,onConnected,onError,onQRCodeUpdate,(data:any)=>{updateBrowserInfo(sessionName,data)});
}

export async function updateBrowserInfo(sessionName:string,data:any){
  const pid=data.browser.process().pid;
  try{
    await updateProcessDataBySessionName(sessionName,{pid});
  }catch(e){
      killProcessByPid(pid);
  }
}



