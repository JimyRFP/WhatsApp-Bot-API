"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumber = void 0;
const meta_sanitizer_1 = __importDefault(require("meta-sanitizer"));
function getNumber(number) {
    if (typeof (number) !== "string")
        return "";
    let prefix = "55";
    let server = "@c.us";
    let useNumber = meta_sanitizer_1.default.justNumbers(number, false);
    if (useNumber.length > 10 || number.indexOf("+") > -1) {
        prefix = "";
    }
    return `${prefix}${useNumber}${server}`;
}
exports.getNumber = getNumber;
