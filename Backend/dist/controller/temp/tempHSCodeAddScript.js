"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.addHSCodeFromLocal = void 0;
const index_1 = require("../../index");
const XLSX = __importStar(require("xlsx"));
const axios_1 = __importDefault(require("axios"));
const addHSCodeFromLocal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = ["2bit", "4bit", "6bit", "8bit"];
        const fileUrls = {
            "2bit": "https://docs.google.com/spreadsheets/d/1khMLbwwURCKu_7KvEbJnoz1nbiI-w7zc/export?format=xlsx",
            "4bit": "https://docs.google.com/spreadsheets/d/1RUdegr76TP-w816ZOUP8Cfg91P4rLPEh/export?format=xlsx",
            "6bit": "https://docs.google.com/spreadsheets/d/1Eoo3CCtai5ZxDxHUDw4FfB08ohssrV-m/export?format=xlsx",
            "8bit": "https://docs.google.com/spreadsheets/d/1kNa2IZdVt5RQWN4M_A-O2R6PsSK8gWww/export?format=xlsx"
        };
        const sheetNames = {
            "2bit": "HS 2 digit",
            "4bit": "HS 4 digit",
            "6bit": "6 digit",
            "8bit": "8 digit"
        };
        for (const type of types) {
            console.log(`Processing type: ${type}`);
            const fileUrl = fileUrls[type];
            const sheetName = sheetNames[type];
            console.log(`Downloading file from URL: ${fileUrl}`);
            const response = yield axios_1.default.get(fileUrl, { responseType: 'arraybuffer' });
            const fileBuffer = Buffer.from(response.data, 'binary');
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            console.log(`Converting sheet to JSON for sheet name: ${sheetName}`);
            const data = sheet.map((row) => ({
                HSCode: (row.HSCode).toString(),
                Commodity: (row.Commodity).toString(),
            }));
            console.log(`Inserting data into database for type: ${type}`);
            switch (type) {
                case "2bit":
                    yield index_1.prisma.hSCode2Bit.createMany({ data });
                    break;
                case "4bit":
                    yield index_1.prisma.hSCode4Bit.createMany({ data });
                    break;
                case "6bit":
                    yield index_1.prisma.hSCode6Bit.createMany({ data });
                    break;
                case "8bit":
                    yield index_1.prisma.hSCode8Bit.createMany({ data });
                    break;
            }
        }
        console.log("HS Codes added successfully from local files");
        res.status(200).json({ message: "HS Codes added successfully from local files" });
    }
    catch (error) {
        console.error("Error adding HS Codes from local files:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addHSCodeFromLocal = addHSCodeFromLocal;
