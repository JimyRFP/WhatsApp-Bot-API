import { venomClient } from "../../types/index";
export declare function getClientAndCheckConnection(userId: number, sessionId: number): Promise<venomClient>;
export declare function getGlobalVenomClientBySessionName(sessionName: string): venomClient | false;
export declare function setGlobalVenomClient(sessionName: string, client: any): venomClient;
export declare function updateClientDeviceInfoBySessionName(sessionName: string): Promise<venomClient | false>;
export declare function destroySession(sessionName: string): Promise<false | undefined>;
export declare function reconnectClientBySession(sessionName: string, options?: any): Promise<unknown>;
