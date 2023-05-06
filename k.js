const venom=require("venom-bot");
const {setGlobalVenomClient}=require("./dist/venom/control/clientControl")
venom.create({headless:false,debug:false,devtools:true}).then(start).catch((e)=>{console.log(e)});

async function start(c){
   try{
      let a=setGlobalVenomClient("1",c);
      c.sendText("554999254272@c.us","ok");
      let msgs=await c.getAllMessagesInChat("554999254272@c.us");
      for(let msg of msgs){
         console.log(`${msg.sender.user} ${msg.type} ${msg.body?.slice(0,50)}`);
      }
   }catch(e){
      console.log(e); 
   }
}

