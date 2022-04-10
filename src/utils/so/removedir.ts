import {exec} from 'child_process';
import meta_sanitizer from 'meta-sanitizer';
export async function removeDir(dir:string){
    let filtereddir=meta_sanitizer.charInsertEngine(dir,[" "],"\\").sanitizedData;
    let command=`rm -r ${filtereddir}`;
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