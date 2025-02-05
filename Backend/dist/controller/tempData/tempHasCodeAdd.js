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
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx = __importStar(require("xlsx"));
const __1 = require("../..");
const express_1 = require("express");
//! TEMP CODE
//! TEMP CODE
//! TEMP CODE
//! TEMP CODE
function insertData(workbookPath, sheetName, model) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Reading data from workbook: ${workbookPath}, sheet: ${sheetName}`);
        const workbook = xlsx.readFile(workbookPath);
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Inserting data into model: ${model}`);
        for (const record of data) {
            console.log(`Inserting record: ${JSON.stringify(record)}`);
            yield model.create({
                data: {
                    HSCode: (record.HSCode).toString(),
                    Commodity: (record.Commodity).toString(),
                },
            });
        }
        console.log(`Finished inserting data from workbook: ${workbookPath}, sheet: ${sheetName}`);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting data insertion process');
        yield insertData('D:/Internship work/sata sir/import_export/Backend/HS 2 digit.xlsx', 'HS 2 digit', __1.prisma.hSCode2Bit);
        yield insertData('D:/Internship work/sata sir/import_export/Backend/HS 4 digit.xlsx', 'HS 4 digit', __1.prisma.hSCode4Bit);
        yield insertData('D:/Internship work/sata sir/import_export/Backend/6 digit.xlsx', '6 digit', __1.prisma.hSCode6Bit);
        yield insertData('D:/Internship work/sata sir/import_export/Backend/8 digit.xlsx', '8 digit', __1.prisma.hSCode8Bit);
        console.log('Data insertion process completed');
    });
}
const route = (0, express_1.Router)();
route.get('/add/hscode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield main();
        res.send('Data insertion process completed');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during the data insertion process');
    }
}));
exports.default = route;
//! TEMP CODE
//! TEMP CODE
//! TEMP CODE
//! TEMP CODE
//! TEMP CODE
