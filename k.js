const venom=require("venom-bot");
venom.create({headless:true,debug:false,devtools:true}).then(start).catch((e)=>{console.log(e)});

async function start(c){
   try{
   console.log((await c.getHostDevice()));
   console.log(await c.sendText("5511912933980@c.us","teste"))
   }catch(e){
      console.log(e); 
   }
}