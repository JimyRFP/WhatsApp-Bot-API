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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDir = void 0;
const child_process_1 = require("child_process");
const meta_sanitizer_1 = __importDefault(require("meta-sanitizer"));
function removeDir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        let filtereddir = meta_sanitizer_1.default.charInsertEngine(dir, [" "], "\\").sanitizedData;
        let command = `rm -r ${filtereddir}`;
        let cp = (0, child_process_1.exec)(command, (error, stdout, stderror) => {
            if (error) {
                return;
            }
            if (stderror) {
                return;
            }
            if (stdout) {
            }
        });
        return new Promise((resolve, reject) => {
            cp.on('exit', () => { resolve(); });
        });
    });
}
exports.removeDir = removeDir;
