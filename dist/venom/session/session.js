"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVenomSessionName = void 0;
function getVenomSessionName(userId, sessionNumber) {
    return `UserId_${userId}_Bot_${sessionNumber}`;
}
exports.getVenomSessionName = getVenomSessionName;
