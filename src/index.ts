import ExpressServer from "serverpreconfigured";
import { initWebSocket } from "./modules/ws";
import { router as wa_router } from "./routes/wa/routes";
const server=new ExpressServer();
const app=server.getApp();
server.initAuthSystem();
server.initWSAuthSystem();
export const wsInstace=initWebSocket(app);
wa_router('/ws',app);

server.listen(3069);

