"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBodyParams = void 0;
const serverpreconfigured_1 = require("serverpreconfigured");
function filterBodyParams(req, res, required, others) {
    const requiredObj = Object.entries(required);
    const othersObj = Object.entries(others);
    let sanitizedData = {};
    for (let i = 0; i < requiredObj.length; i++) {
        const key = requiredObj[i][0];
        const value = requiredObj[i][1];
        if (!Boolean(req.body[key])) {
            res.send((0, serverpreconfigured_1.JSONResponse)(false, 0, "Invalid Params", Object.keys(required)));
            return false;
        }
        sanitizedData[key] = value(req.body[key]);
    }
    for (let i = 0; i < othersObj.length; i++) {
        const key = othersObj[i][0];
        const value = othersObj[i][1];
        if (!Boolean(req.body[key])) {
            continue;
        }
        sanitizedData[key] = value(req.body[key]);
    }
    return sanitizedData;
}
exports.filterBodyParams = filterBodyParams;
