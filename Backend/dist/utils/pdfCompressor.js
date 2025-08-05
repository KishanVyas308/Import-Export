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
exports.checkGhostscriptAvailability = checkGhostscriptAvailability;
exports.compressPDF = compressPDF;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function checkGhostscriptAvailability() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield execAsync('gs --version');
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
function compressPDF(inputPath, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const originalStats = fs_1.default.statSync(inputPath);
            const originalSize = originalStats.size;
            // Use Ghostscript to compress PDF
            const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
            yield execAsync(command);
            if (!fs_1.default.existsSync(outputPath)) {
                throw new Error('Compressed file was not created');
            }
            const compressedStats = fs_1.default.statSync(outputPath);
            const compressedSize = compressedStats.size;
            const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);
            return {
                success: true,
                originalSize,
                compressedSize,
                compressionRatio
            };
        }
        catch (error) {
            return {
                success: false,
                originalSize: 0,
                compressedSize: 0,
                compressionRatio: 0,
                error: error instanceof Error ? error.message : 'Unknown compression error'
            };
        }
    });
}
