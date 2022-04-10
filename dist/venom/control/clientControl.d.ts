import { venomClient } from "../../types/index";
export declare function getGlobalVenomClientBySessionName(sessionName: string): venomClient | false;
export declare function setGlobalVenomClient(sessionName: string, client: any): venomClient;
export declare function updateClientDeviceInfoBySessionName(sessionName: string): Promise<venomClient | false>;
export declare function destroySession(sessionName: string): Promise<false | undefined>;