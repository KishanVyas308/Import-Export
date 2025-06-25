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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInvoice = addInvoice;
exports.addEWayBill = addEWayBill;
exports.addEpcgLicense = addEpcgLicense;
exports.getEpcgLicense = getEpcgLicense;
exports.addEbrc = addEbrc;
exports.addAdvanceLicense = addAdvanceLicense;
exports.addEInvoice = addEInvoice;
exports.addEpcgLicenseSummary = addEpcgLicenseSummary;
const __1 = require("..");
function addInvoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _a = req.body, { productDetails } = _a, InvoiceData = __rest(_a, ["productDetails"]);
            const response = yield __1.prisma.invoice.create({
                data: Object.assign(Object.assign({}, InvoiceData), { productDetails: {
                        create: productDetails,
                    } }),
            });
            return res.json({ message: "Added successfully", response });
        }
        catch (e) {
            console.log(e);
            return res.json({ message: e });
        }
    });
}
function addEWayBill(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const responce = yield __1.prisma.eWayBillDetails.create({
                data: req.body,
            });
        }
        catch (e) {
            return res.json({ message: e });
        }
        return res.json({ message: "Added successfully" });
    });
}
function addEpcgLicense(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _a = req.body, { DocumentEpcgLicenseEoAsPerLicense, DocumentEpcgLicenseActualExport } = _a, epcgLicenseDetails = __rest(_a, ["DocumentEpcgLicenseEoAsPerLicense", "DocumentEpcgLicenseActualExport"]);
            const response = yield __1.prisma.documentEpcgLicense.create({
                data: Object.assign(Object.assign({}, epcgLicenseDetails), { DocumentEpcgLicenseEoAsPerLicense: {
                        create: DocumentEpcgLicenseEoAsPerLicense,
                    }, DocumentEpcgLicenseActualExport: {
                        create: DocumentEpcgLicenseActualExport,
                    } }),
            });
            console.log("Response from EPCG License creation:", response);
            return res.json({ message: "Added successfully", response });
        }
        catch (e) {
            console.log(e);
            return res.json({ message: e });
        }
    });
}
function getEpcgLicense(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { srNo } = req.query;
            if (!srNo) {
                return res.status(400).json({ message: "Sr No is required" });
            }
            const epcgLicense = yield __1.prisma.documentEpcgLicense.findFirst({
                where: {
                    srNo: srNo
                },
                include: {
                    DocumentEpcgLicenseEoAsPerLicense: true,
                    DocumentEpcgLicenseActualExport: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            contactPersonName: true
                        }
                    }
                }
            });
            if (!epcgLicense) {
                return res.status(404).json({ message: "EPCG License not found" });
            }
            return res.json({
                message: "EPCG License found successfully",
                data: epcgLicense
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error", error });
        }
    });
}
function addEbrc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const responce = yield __1.prisma.eBRC.create({
                data: req.body,
            });
        }
        catch (e) {
            console.log(e);
            return res.json({ message: e });
        }
        return res.json({ message: "Added successfully" });
    });
}
function addAdvanceLicense(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const responce = yield __1.prisma.advanceLicense.create({
                data: req.body,
            });
        }
        catch (e) {
            console.log(e);
            return res.json({ message: e });
        }
        return res.json({ message: "Added successfully" });
    });
}
function addEInvoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _a = req.body, { productDetails } = _a, eInvoiceData = __rest(_a, ["productDetails"]);
            const eInvoice = yield __1.prisma.eInvoice.create({
                data: Object.assign(Object.assign({}, eInvoiceData), { productDetails: {
                        create: productDetails,
                    } }),
            });
            return res.json({ message: "Added successfully", eInvoice });
        }
        catch (e) {
            console.log(e);
            return res.json({ message: e });
        }
    });
}
function addEpcgLicenseSummary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const responce = yield __1.prisma.epcgLicenseSummary.create({
                data: req.body,
            });
            return res.json({ message: "Added successfully", responce });
        }
        catch (e) {
            console.log(e);
            return res.json({ message: e });
        }
    });
}
