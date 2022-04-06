"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSResponse = void 0;
function WSResponse(isOK, message = '', errorMessage = "", data = {}) {
    return JSON.stringify({
        is_ok: isOK,
        message: message,
        error_message: errorMessage,
        data: data
    });
}
exports.WSResponse = WSResponse;
