export declare function sendTextMessage(client: any, message: string, to: string, onSend?: any, onError?: any): Promise<any>;
export declare function sendMassiveTextMessage(client: any, message: string, to: Array<string>, onEnd?: any): Promise<{
    ok: {
        to_index: number;
        result: any;
    }[];
    error: {
        to_index: number;
        error: any;
    }[];
}>;
