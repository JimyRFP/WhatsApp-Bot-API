const venom=require("venom-bot-updated");
const {setGlobalVenomClient}=require("./dist/venom/control/clientControl")
venom.create({headless:false,debug:false,devtools:true}).then(start).catch((e)=>{console.log(e)});

async function start(c){
   try{
      let a=setGlobalVenomClient("1",c);
      console.log(a);
      a.removeOnMessage=await a.client.onMessage((m)=>{
         console.log("1");
      });
      await a.removeOnMessage.remove()
      a.removeOnMessage=await a.client.onMessage((m)=>{
         console.log("2");
      });
      await a.client.onMessage((m)=>{
         console.log("3");
      });
      
   }catch(e){
      console.log(e); 
   }
}

