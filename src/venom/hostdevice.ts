export async function getHostDevice(client:any){
   const result=await maxTime(10000,client.getHostDevice);
   return result;
   function maxTime(max:number,promise:any){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve(false)},max);
        promise().then((r:any)=>{resolve(r);}).catch((e:any)=>{resolve(false)});
    });
  }
}