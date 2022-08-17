import { JSONResponse } from "serverpreconfigured";
export function filterBodyParams(req:any,res:any,required:any,others:any){
    const requiredObj=Object.entries(required);
    const othersObj=Object.entries(others);
    let sanitizedData:any={};
    for(let i=0;i<requiredObj.length;i++){
        const key:any=requiredObj[i][0];
        const value:any=requiredObj[i][1];
        if(!Boolean(req.body[key])){
            res.send(JSONResponse(false,0,"Invalid Params",Object.keys(required)));
            return false;
        }    
        sanitizedData[key]=value(req.body[key]);
    }
     for(let i=0;i<othersObj.length;i++){
         const key:any=othersObj[i][0];
         const value:any=othersObj[i][1];
         if(!Boolean(req.body[key])){
             continue;
         }    
         sanitizedData[key]=value(req.body[key]);
     }
     return sanitizedData;
 }