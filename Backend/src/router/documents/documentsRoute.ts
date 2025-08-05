import express from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middleWare";
import { LocalFileService } from "../../services/localFileService";
import { prisma } from "../../index";
import {
  compressPDF,
  checkGhostscriptAvailability,
} from "../../utils/pdfCompressor";

const router = express.Router();
const fileService = LocalFileService.getInstance();

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
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
  } else {
    cb(new Error("Only PDF, DOC, DOCX, and image files are allowed"), false);
  }
};

const upload = multer({
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
router.post(
  "/upload/:clientId",
  verifyToken,
  upload.single("document"),
  async (req, res) => {
    try {
      const { clientId } = req.params;
      const { documentType } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!documentType || !DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES]) {
        return res.status(400).json({ error: "Invalid document type" });
      }

      // Check if client exists
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      });

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(req.file.originalname);
      const fileName = `${documentType}-${clientId}-${uniqueSuffix}${ext}`;

      // Check if document should be compressed (PDF files > 2MB)
      const shouldCompress = 
        req.file.mimetype === "application/pdf" && 
        req.file.size > 2 * 1024 * 1024 &&
        req.body.compress !== "false";

      let fileInfo;

      if (shouldCompress) {
        const ghostscriptAvailable = await checkGhostscriptAvailability();
        
        if (ghostscriptAvailable) {
          // Upload original file temporarily
          const tempFile = await fileService.uploadFile(
            req.file.buffer,
            `temp-${fileName}`,
            req.file.originalname,
            req.file.mimetype
          );

          try {
            // Compress the PDF
            const compressedFileName = `compressed-${fileName}`;
            const compressedFilePath = path.join(
              path.dirname(tempFile.filePath),
              compressedFileName
            );

            const compressionResult = await compressPDF(
              tempFile.filePath,
              compressedFilePath
            );

            if (compressionResult.success) {
              // Read the compressed file
              const fs = require("fs").promises;
              const compressedBuffer = await fs.readFile(compressedFilePath);

              // Save the compressed file with the final name
              fileInfo = await fileService.uploadFile(
                compressedBuffer,
                fileName,
                req.file.originalname,
                req.file.mimetype
              );

              // Clean up temporary files
              await fileService.deleteFile(tempFile.filePath);
              await fs.unlink(compressedFilePath);

              console.log(
                `PDF compressed: Original size: ${compressionResult.originalSize} bytes, Compressed size: ${compressionResult.compressedSize} bytes, Ratio: ${compressionResult.compressionRatio}%`
              );
            } else {
              // Use original file if compression fails
              fileInfo = tempFile;
            }
          } catch (compressionError) {
            console.warn("PDF compression failed, using original file:", compressionError);
            fileInfo = tempFile;
          }
        } else {
          // Upload without compression
          fileInfo = await fileService.uploadFile(
            req.file.buffer,
            fileName,
            req.file.originalname,
            req.file.mimetype
          );
        }
      } else {
        // Upload without compression
        fileInfo = await fileService.uploadFile(
          req.file.buffer,
          fileName,
          req.file.originalname,
          req.file.mimetype
        );
      }

      // Check if document of same type already exists for this client
      const existingDocument = await prisma.clientDocument.findFirst({
        where: {
          clientId,
          documentType
        }
      });

      if (existingDocument) {
        // Delete the old file
        try {
          await fileService.deleteFile(existingDocument.filePath);
        } catch (error) {
          console.warn("Failed to delete old document file:", error);
        }

        // Update existing document record
        const updatedDocument = await prisma.clientDocument.update({
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
          document: {
            ...updatedDocument,
            url: fileInfo.url,
            documentTypeName: DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES]
          }
        });
      } else {
        // Create new document record
        const newDocument = await prisma.clientDocument.create({
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
          document: {
            ...newDocument,
            url: fileInfo.url,
            documentTypeName: DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES]
          }
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

// Get all documents for a client
router.get("/client/:clientId", verifyToken, async (req, res) => {
  try {
    const { clientId } = req.params;

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const documents = await prisma.clientDocument.findMany({
      where: { clientId },
      orderBy: { uploadedDate: "desc" }
    });

    const documentsWithUrls = documents.map(doc => ({
      ...doc,
      url: fileService.getFileUrl(doc.fileName),
      documentTypeName: DOCUMENT_TYPES[doc.documentType as keyof typeof DOCUMENT_TYPES]
    }));

    res.json({
      clientId,
      clientName: client.customerName,
      documents: documentsWithUrls
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ error: "Failed to get documents" });
  }
});

// Get specific document by ID
router.get("/:documentId", verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.clientDocument.findUnique({
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

    res.json({
      ...document,
      url: fileService.getFileUrl(document.fileName),
      documentTypeName: DOCUMENT_TYPES[document.documentType as keyof typeof DOCUMENT_TYPES]
    });
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({ error: "Failed to get document" });
  }
});

// Update document description
router.put("/:documentId", verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { description } = req.body;

    const document = await prisma.clientDocument.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const updatedDocument = await prisma.clientDocument.update({
      where: { id: documentId },
      data: { description: description || "" }
    });

    res.json({
      message: "Document updated successfully",
      document: {
        ...updatedDocument,
        url: fileService.getFileUrl(updatedDocument.fileName),
        documentTypeName: DOCUMENT_TYPES[updatedDocument.documentType as keyof typeof DOCUMENT_TYPES]
      }
    });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete document
router.delete("/:documentId", verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.clientDocument.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete the file from filesystem
    try {
      await fileService.deleteFile(document.filePath);
    } catch (error) {
      console.warn("Failed to delete document file:", error);
    }

    // Delete document record from database
    await prisma.clientDocument.delete({
      where: { id: documentId }
    });

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Get document types
router.get("/types/list", verifyToken, async (req, res) => {
  try {
    const types = Object.entries(DOCUMENT_TYPES).map(([key, value]) => ({
      key,
      label: value
    }));

    res.json({ documentTypes: types });
  } catch (error) {
    console.error("Get document types error:", error);
    res.status(500).json({ error: "Failed to get document types" });
  }
});

// Check compression availability
router.get("/compression/status", verifyToken, async (req, res) => {
  try {
    const isAvailable = await checkGhostscriptAvailability();
    res.json({
      ghostscriptAvailable: isAvailable,
      compressionEnabled: isAvailable,
      message: isAvailable
        ? "PDF compression is available and enabled"
        : "PDF compression is disabled - Ghostscript not found",
    });
  } catch (error) {
    console.error("Compression status check error:", error);
    res.status(500).json({
      ghostscriptAvailable: false,
      compressionEnabled: false,
      error: "Failed to check compression status",
    });
  }
});

export default router;
