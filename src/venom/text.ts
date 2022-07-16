export async function sendTextMessage(client:any,
                                      message:string,
                                      to:string,
                                      onSend:any=null,
                                      onError:any=null){
    try{
       let result=await client.sendText2(to,message);
       if(onSend)
         onSend(result);
       return result;         
    }catch(e){
        if(onError)
           onError(e); 
        return false;         
    } 
}
export async function sendMassiveTextMessage(client:any,
                                             message:string,
                                             to:Array<string>,
                                             onEnd:any=null
                                             ){
    let result_ok=[];
    let result_error=[];
    if(!Array.isArray(to))
      throw "to param must be array";
    for(let i=0;i<to.length;i++){
      try{
         let r=await client.sendText2(to[i],message);
         result_ok.push({to_index:i,result:r});
      }catch(e){
         result_error.push({to_index:i,error:e});
      }   
    }
    let ret={ok:result_ok,error:result_error};
    if(onEnd)
      onEnd(ret);
    return ret;
}