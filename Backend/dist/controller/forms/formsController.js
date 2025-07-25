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
exports.getEWayBillById = exports.getEWayBillData = exports.getEInvoiceById = exports.getEInvoiceData = void 0;
const __1 = require("../..");
const getEInvoiceData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield __1.prisma.eInvoice.findMany({
            include: {
                productDetails: true,
                user: {
                    select: {
                        id: true,
                        contactPersonName: true,
                        email: true,
                        companyName: true
                    }
                }
            },
            orderBy: {
                uploadedDate: 'desc'
            }
        });
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching eInvoice data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getEInvoiceData = getEInvoiceData;
const getEInvoiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield __1.prisma.eInvoice.findUnique({
            where: { id },
            include: {
                productDetails: true,
                user: {
                    select: {
                        id: true,
                        contactPersonName: true,
                        email: true,
                        companyName: true
                    }
                }
            }
        });
        if (!data) {
            return res.status(404).json({ error: "E-Invoice not found" });
        }
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching eInvoice by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getEInvoiceById = getEInvoiceById;
const getEWayBillData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield __1.prisma.eWayBillDetails.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        contactPersonName: true,
                        email: true,
                        companyName: true
                    }
                }
            },
            orderBy: {
                uploadedDate: 'desc'
            }
        });
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching eWayBill data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getEWayBillData = getEWayBillData;
const getEWayBillById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield __1.prisma.eWayBillDetails.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        contactPersonName: true,
                        email: true,
                        companyName: true
                    }
                }
            }
        });
        if (!data) {
            return res.status(404).json({ error: "E-Way Bill not found" });
        }
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching eWayBill by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getEWayBillById = getEWayBillById;
