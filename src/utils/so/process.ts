const {exec}=require('child_process');
export async function killProcessByPid(pid:Number){
   let command=`kill -9 ${pid}`;
   let cp=exec(command,(error:any,stdout:any,stderror:any)=>{
      if(error){

          return;
      }
      if(stderror){

        return;
      }   
      if(stdout){

      }    
   });
   return new Promise((resolve:any,reject:any)=>{
     cp.on('exit',()=>{resolve();});
   });
}