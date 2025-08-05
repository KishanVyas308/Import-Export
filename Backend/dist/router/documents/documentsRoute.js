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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const middleWare_1 = require("../../middleWare");
const localFileService_1 = require("../../services/localFileService");
const index_1 = require("../../index");
const pdfCompressor_1 = require("../../utils/pdfCompressor");
const router = express_1.default.Router();
const fileService = localFileService_1.LocalFileService.getInstance();
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Allow PDF, DOC, DOCX, and image files
    const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp"
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF, DOC, DOCX, and image files are allowed"), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30MB limit
    },
});
// Document type mapping
const DOCUMENT_TYPES = {
    FIRM_PAN: "Firm Pan",
    IEC_CERTIFICATE: "IEC Certificate",
    RCMC_CERTIFICATE: "RCMC Certificate",
    UDYAM_CERTIFICATE: "Udyam Certificate",
    GST_CERTIFICATE: "GST Certificate",
    PARTNERSHIP_DEED: "Partnership Deed / MOA"
};
// Upload document for client
router.post("/upload/:clientId", middleWare_1.verifyToken, upload.single("document"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientId } = req.params;
        const { documentType } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        if (!documentType || !DOCUMENT_TYPES[documentType]) {
            return res.status(400).json({ error: "Invalid document type" });
        }
        // Check if client exists
        const client = yield index_1.prisma.client.findUnique({
            where: { id: clientId }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(req.file.originalname);
        const fileName = `${documentType}-${clientId}-${uniqueSuffix}${ext}`;
        // Check if document should be compressed (PDF files > 2MB)
        const shouldCompress = req.file.mimetype === "application/pdf" &&
            req.file.size > 2 * 1024 * 1024 &&
            req.body.compress !== "false";
        let fileInfo;
        if (shouldCompress) {
            const ghostscriptAvailable = yield (0, pdfCompressor_1.checkGhostscriptAvailability)();
            if (ghostscriptAvailable) {
                // Upload original file temporarily
                const tempFile = yield fileService.uploadFile(req.file.buffer, `temp-${fileName}`, req.file.originalname, req.file.mimetype);
                try {
                    // Compress the PDF
                    const compressedFileName = `compressed-${fileName}`;
                    const compressedFilePath = path_1.default.join(path_1.default.dirname(tempFile.filePath), compressedFileName);
                    const compressionResult = yield (0, pdfCompressor_1.compressPDF)(tempFile.filePath, compressedFilePath);
                    if (compressionResult.success) {
                        // Read the compressed file
                        const fs = require("fs").promises;
                        const compressedBuffer = yield fs.readFile(compressedFilePath);
                        // Save the compressed file with the final name
                        fileInfo = yield fileService.uploadFile(compressedBuffer, fileName, req.file.originalname, req.file.mimetype);
                        // Clean up temporary files
                        yield fileService.deleteFile(tempFile.filePath);
                        yield fs.unlink(compressedFilePath);
                        console.log(`PDF compressed: Original size: ${compressionResult.originalSize} bytes, Compressed size: ${compressionResult.compressedSize} bytes, Ratio: ${compressionResult.compressionRatio}%`);
                    }
                    else {
                        // Use original file if compression fails
                        fileInfo = tempFile;
                    }
                }
                catch (compressionError) {
                    console.warn("PDF compression failed, using original file:", compressionError);
                    fileInfo = tempFile;
                }
            }
            else {
                // Upload without compression
                fileInfo = yield fileService.uploadFile(req.file.buffer, fileName, req.file.originalname, req.file.mimetype);
            }
        }
        else {
            // Upload without compression
            fileInfo = yield fileService.uploadFile(req.file.buffer, fileName, req.file.originalname, req.file.mimetype);
        }
        // Check if document of same type already exists for this client
        const existingDocument = yield index_1.prisma.clientDocument.findFirst({
            where: {
                clientId,
                documentType
            }
        });
        if (existingDocument) {
            // Delete the old file
            try {
                yield fileService.deleteFile(existingDocument.filePath);
            }
            catch (error) {
                console.warn("Failed to delete old document file:", error);
            }
            // Update existing document record
            const updatedDocument = yield index_1.prisma.clientDocument.update({
                where: { id: existingDocument.id },
                data: {
                    fileName: fileInfo.name,
                    originalName: req.file.originalname,
                    filePath: fileInfo.filePath,
                    fileSize: fileInfo.size,
                    mimeType: req.file.mimetype,
                    uploadedDate: new Date()
                }
            });
            res.json({
                message: "Document updated successfully",
                document: Object.assign(Object.assign({}, updatedDocument), { url: fileInfo.url, documentTypeName: DOCUMENT_TYPES[documentType] })
            });
        }
        else {
            // Create new document record
            const newDocument = yield index_1.prisma.clientDocument.create({
                data: {
                    clientId,
                    documentType,
                    fileName: fileInfo.name,
                    originalName: req.file.originalname,
                    filePath: fileInfo.filePath,
                    fileSize: fileInfo.size,
                    mimeType: req.file.mimetype
                }
            });
            res.json({
                message: "Document uploaded successfully",
                document: Object.assign(Object.assign({}, newDocument), { url: fileInfo.url, documentTypeName: DOCUMENT_TYPES[documentType] })
            });
        }
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "File upload failed" });
    }
}));
// Get all documents for a client
router.get("/client/:clientId", middleWare_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientId } = req.params;
        // Check if client exists
        const client = yield index_1.prisma.client.findUnique({
            where: { id: clientId }
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        const documents = yield index_1.prisma.clientDocument.findMany({
            where: { clientId },
            orderBy: { uploadedDate: "desc" }
        });
        const documentsWithUrls = documents.map(doc => (Object.assign(Object.assign({}, doc), { url: fileService.getFileUrl(doc.fileName), documentTypeName: DOCUMENT_TYPES[doc.documentType] })));
        res.json({
            clientId,
            clientName: client.customerName,
            documents: documentsWithUrls
        });
    }
    catch (error) {
        console.error("Get documents error:", error);
        res.status(500).json({ error: "Failed to get documents" });
    }
}));
// Get specific document by ID
router.get("/:documentId", middleWare_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId } = req.params;
        const document = yield index_1.prisma.clientDocument.findUnique({
            where: { id: documentId },
            include: {
                client: {
                    select: {
                        id: true,
                        customerName: true
                    }
                }
            }
        });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(Object.assign(Object.assign({}, document), { url: fileService.getFileUrl(document.fileName), documentTypeName: DOCUMENT_TYPES[document.documentType] }));
    }
    catch (error) {
        console.error("Get document error:", error);
        res.status(500).json({ error: "Failed to get document" });
    }
}));
// Update document description
router.put("/:documentId", middleWare_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId } = req.params;
        const { description } = req.body;
        const document = yield index_1.prisma.clientDocument.findUnique({
            where: { id: documentId }
        });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        const updatedDocument = yield index_1.prisma.clientDocument.update({
            where: { id: documentId },
            data: { description: description || "" }
        });
        res.json({
            message: "Document updated successfully",
            document: Object.assign(Object.assign({}, updatedDocument), { url: fileService.getFileUrl(updatedDocument.fileName), documentTypeName: DOCUMENT_TYPES[updatedDocument.documentType] })
        });
    }
    catch (error) {
        console.error("Update document error:", error);
        res.status(500).json({ error: "Failed to update document" });
    }
}));
// Delete document
router.delete("/:documentId", middleWare_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documentId } = req.params;
        const document = yield index_1.prisma.clientDocument.findUnique({
            where: { id: documentId }
        });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        // Delete the file from filesystem
        try {
            yield fileService.deleteFile(document.filePath);
        }
        catch (error) {
            console.warn("Failed to delete document file:", error);
        }
        // Delete document record from database
        yield index_1.prisma.clientDocument.delete({
            where: { id: documentId }
        });
        res.json({ message: "Document deleted successfully" });
    }
    catch (error) {
        console.error("Delete document error:", error);
        res.status(500).json({ error: "Failed to delete document" });
    }
}));
// Get document types
router.get("/types/list", middleWare_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = Object.entries(DOCUMENT_TYPES).map(([key, value]) => ({
            key,
            label: value
        }));
        res.json({ documentTypes: types });
    }
    catch (error) {
        console.error("Get document types error:", error);
        res.status(500).json({ error: "Failed to get document types" });
    }
}));
// Check compression availability
router.get("/compression/status", middleWare_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAvailable = yield (0, pdfCompressor_1.checkGhostscriptAvailability)();
        res.json({
            ghostscriptAvailable: isAvailable,
            compressionEnabled: isAvailable,
            message: isAvailable
                ? "PDF compression is available and enabled"
                : "PDF compression is disabled - Ghostscript not found",
        });
    }
    catch (error) {
        console.error("Compression status check error:", error);
        res.status(500).json({
            ghostscriptAvailable: false,
            compressionEnabled: false,
            error: "Failed to check compression status",
        });
    }
}));
exports.default = router;
