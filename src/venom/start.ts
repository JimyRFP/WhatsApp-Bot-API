const venom=require('venom-bot');

export function startVenom(sessionName:string,options:any={},onConnected:any,onError:any,onQRCodeUpdate:any,browserInfo:any){
  venom.create(
      sessionName,
      (base64Qrimg:any, asciiQR:any, attempts:any, urlCode:any) => {
        if(onQRCodeUpdate==undefined)
          return;
        onQRCodeUpdate({base64Qrimg:base64Qrimg,asciiQR:asciiQR,attempts:attempts,urlCode:urlCode});
      },
      (statusSession:any, session:any) => {

      },
      {
        logQR:options.logQR?options.logQR:false,
        disableSpins:options.disableSpins?options.disableSpins:true,
        disableWelcome:options.disableWelcome?options.disableWelcome:true,
        updateLogs:options.updateLogs?options.updateLogs:false,
        headless:options.headless?options.headless:false
      },
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
}

