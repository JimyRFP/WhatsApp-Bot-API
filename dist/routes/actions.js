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
exports.router = void 0;
const serverpreconfigured_1 = require("serverpreconfigured");
const express_1 = require("express");
const filter_1 = require("../utils/response/filter");
const getNumber_1 = require("../venom/utils/getNumber");
const meta_sanitizer_1 = __importDefault(require("meta-sanitizer"));
const clientControl_1 = require("../venom/control/clientControl");
exports.router = (0, express_1.Router)();
exports.router.post('/sendText', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const required = {
            'to': getNumber_1.getNumber,
            'text': (s) => s
        };
        const filtered = (0, filter_1.filterBodyParams)(req, res, required, {});
        if (!filtered)
            return;
        const client = yield (0, clientControl_1.getClientAndCheckConnection)(req.user.id, 1);
        let result = yield client.client.sendText2(filtered.to, filtered.text);
        return res.send((0, serverpreconfigured_1.JSONResponse)(true, 0, '', result));
    }
    catch (e) {
        return res.status(500).send((0, serverpreconfigured_1.JSONResponse)(true, 0, "I-E", e));
    }
}));
exports.router.post('/sendVCard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const required = {
            'to': getNumber_1.getNumber,
            'contact': getNumber_1.getNumber,
        };
        const otherParams = {
            'name': (s) => meta_sanitizer_1.default.justCharsAndNumbers(s, true)
        };
        const filtered = (0, filter_1.filterBodyParams)(req, res, required, otherParams);
        if (!filtered)
            return;
        const client = yield (0, clientControl_1.getClientAndCheckConnection)(req.user.id, 1);
        let result = yield client.client.sendContactVcard(filtered.to, filtered.contact, filtered.name);
        return res.send((0, serverpreconfigured_1.JSONResponse)(true, 0, '', result));
    }
    catch (e) {
        return res.status(500).send((0, serverpreconfigured_1.JSONResponse)(true, 0, "I-E", e));
    }
}));
exports.router.post('/getContacts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let client = yield (0, clientControl_1.getClientAndCheckConnection)(req.user.id, 1);
        let contacts = yield client.client.getAllContacts();
        return res.send((0, serverpreconfigured_1.JSONResponse)(true, 0, '', contacts));
    }
    catch (e) {
        return res.status(500).send((0, serverpreconfigured_1.JSONResponse)(true, 0, "I-E", e));
    }
}));
