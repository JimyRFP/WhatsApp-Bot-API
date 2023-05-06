import {JSONResponse,setUserDataMiddleware} from "serverpreconfigured";
import { Router } from "express";
import { filterBodyParams } from "../utils/response/filter";
import { getNumber } from "../venom/utils/getNumber";
import meta_sanitizer from "meta-sanitizer";
import { getClientAndCheckConnection } from "../venom/control/clientControl";
export const router=Router();



router.post('/sendText',async (req:any,res:any)=>{
    try{
     const required={
        'to':getNumber,
        'text':(s:string)=>s
     };
     const filtered=filterBodyParams(req,res,required,{});
     if(!filtered)
       return;
     const client=await getClientAndCheckConnection(req.user.id,1);
     let result=await client.client.sendText(filtered.to,filtered.text);  
     return res.send(JSONResponse(true,0,'',result));
    }catch(e){
        return res.status(500).send(JSONResponse(true,0,"I-E",e));

    }
});

router.post('/sendVCard',async (req:any,res:any)=>{
    try{
     const required={
        'to':getNumber,
        'contact':getNumber,
     };
     const otherParams={
        'name':(s:string)=>meta_sanitizer.justCharsAndNumbers(s,true)
     }
     const filtered=filterBodyParams(req,res,required,otherParams);
     if(!filtered)
       return;
     const client=await getClientAndCheckConnection(req.user.id,1);
     let result=await client.client.sendContactVcard(filtered.to,   
                                                     filtered.contact,
                                                     filtered.name) 
     return res.send(JSONResponse(true,0,'',result));
    }catch(e){
        return res.status(500).send(JSONResponse(true,0,"I-E",e));
    }
});

router.post('/getContacts',async (req:any,res:any)=>{
    try{
       let client=await getClientAndCheckConnection(req.user.id,1);
       let contacts=await client.client.getAllContacts();
       return res.send(JSONResponse(true,0,'',contacts));
    }catch(e){
       return res.status(500).send(JSONResponse(true,0,"I-E",e));
    }
});

