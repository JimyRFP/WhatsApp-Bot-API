export function WSResponse(isOK:boolean,message:string='',errorMessage:string="",data:any={}):string{
   return JSON.stringify({
     is_ok:isOK,
     message:message,
     error_message:errorMessage,     
     data:data
   });
}