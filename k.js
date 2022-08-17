const venom=require("venom-bot-updated");
const {setGlobalVenomClient}=require("./dist/venom/control/clientControl")
venom.create({headless:false,debug:false,devtools:true}).then(start).catch((e)=>{console.log(e)});

async function start(c){
   try{
      let a=setGlobalVenomClient("1",c);
      c.sendContactVcard("554999254272@c.us","554999254272@c.us","meu numer");
      c.sendContactVcard("554999254272@c.us","554999254272@c.us","meu numer");
      c.sendContactVcard("554999254272@c.us","554999254272@c.us","meu numer");
      c.sendContactVcard("554999254272@c.us","554999254272@c.us","meu numer");
   }catch(e){
      console.log(e); 
   }
}

