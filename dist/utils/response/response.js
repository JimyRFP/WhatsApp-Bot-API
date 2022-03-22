"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function WSResponse(isOK, message = '', errorMessage = "", data = {}) {
    return JSON.stringify({
        is_ok: isOK,
        message: message,
        error_message: errorMessage,
        data: data
    });
}
exports.WSResponse = WSResponse;
