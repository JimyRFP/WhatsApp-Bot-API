"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostDevice = void 0;
function getHostDevice(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield maxTime(10000, client.getHostDevice);
        return result;
        function maxTime(max, promise) {
            return new Promise((resolve, reject) => {
                setTimeout(() => { resolve(false); }, max);
                promise().then((r) => { resolve(r); }).catch((e) => { resolve(false); });
            });
        }
    });
}
exports.getHostDevice = getHostDevice;
