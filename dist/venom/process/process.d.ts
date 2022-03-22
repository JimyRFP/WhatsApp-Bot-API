import { VenomSession } from "../../database/models/VenomSession";
export declare function getProcessDataBySessionName(sessionName: string): Promise<VenomSession | null>;
export declare function updateProcessDataBySessionName(sessionName: string, data: {
    pid: Number;
}): Promise<VenomSession>;
export declare function killProcessBySessionName(sessionName: string): Promise<unknown>;
