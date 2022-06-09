export declare function startVenom(sessionName: string, options: any, onConnected: any, onError: any, onQRCodeUpdate: any, browserInfo: any): void;
export declare function killSessionAndStartVenom(sessionName: string, options: any, onConnected: any, onError: any, onQRCodeUpdate: any, browserInfo: any): Promise<void>;
export declare function killSessionAndStartVenomSafe(sessionName: string, options: any, onConnected: any, onError: any, onQRCodeUpdate: any): Promise<void>;
export declare function updateBrowserInfo(sessionName: string, data: any): Promise<void>;
