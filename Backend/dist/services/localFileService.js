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
exports.LocalFileService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const unlink = (0, util_1.promisify)(fs_1.default.unlink);
const readdir = (0, util_1.promisify)(fs_1.default.readdir);
const stat = (0, util_1.promisify)(fs_1.default.stat);
class LocalFileService {
    constructor() {
        this.uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        this.ensureUploadsDirectory();
    }
    static getInstance() {
        if (!LocalFileService.instance) {
            LocalFileService.instance = new LocalFileService();
        }
        return LocalFileService.instance;
    }
    ensureUploadsDirectory() {
        if (!fs_1.default.existsSync(this.uploadsDir)) {
            fs_1.default.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }
    uploadFile(buffer, fileName, originalName, mimeType) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(this.uploadsDir, fileName);
            yield writeFile(filePath, buffer);
            const stats = yield stat(filePath);
            return {
                id: fileName,
                name: fileName,
                originalName,
                size: stats.size,
                url: `/api/uploads/${fileName}`,
                filePath,
                uploadedAt: new Date()
            };
        });
    }
    uploadPDF(buffer, fileName, originalName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.uploadFile(buffer, fileName, originalName, 'application/pdf');
        });
    }
    deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = path_1.default.isAbsolute(filePath) ? filePath : path_1.default.join(this.uploadsDir, filePath);
            if (fs_1.default.existsSync(fullPath)) {
                yield unlink(fullPath);
            }
        });
    }
    getFileInfo(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(this.uploadsDir, fileName);
            if (!fs_1.default.existsSync(filePath)) {
                return null;
            }
            const stats = yield stat(filePath);
            return {
                id: fileName,
                name: fileName,
                originalName: fileName,
                size: stats.size,
                url: `/api/uploads/${fileName}`,
                filePath,
                uploadedAt: stats.birthtime
            };
        });
    }
    listFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield readdir(this.uploadsDir);
            const fileInfos = [];
            for (const file of files) {
                const fileInfo = yield this.getFileInfo(file);
                if (fileInfo) {
                    fileInfos.push(fileInfo);
                }
            }
            return fileInfos;
        });
    }
    getFileUrl(fileName) {
        return `/api/uploads/${fileName}`;
    }
}
exports.LocalFileService = LocalFileService;
