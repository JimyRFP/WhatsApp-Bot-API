import { VenomSession } from "../../database/models/VenomSession";
import { killProcessByPid } from "../../utils/so/process";
export async function getProcessDataBySessionName(sessionName:string){
    try{
        let r=await VenomSession.findOne({where:{session_name:sessionName}});
        return r;
    }catch(e){
        throw e;
    }
}
export async function updateProcessDataBySessionName(sessionName:string,data:{pid:Number}){
    try{
       let session=await getProcessDataBySessionName(sessionName);
       if(session==null || session==undefined){
           session=await VenomSession.create({session_name:sessionName,browser_pid:data.pid.toString()});
        }{
          session.browser_pid=data.pid.toString();
          await session.save();
        }
       return session;
    }catch(e){
        throw e;
    }
}
export async function killProcessBySessionName(sessionName:string){
    try{
      let s=await getProcessDataBySessionName(sessionName);
      if(s==null || s==undefined){
         return false;
      }else{
         return await killProcessByPid(parseInt(s.browser_pid));
      }
    }catch(e){
        throw e;
    }
}