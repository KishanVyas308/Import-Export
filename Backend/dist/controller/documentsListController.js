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
exports.addEbrc = addEbrc;
exports.addAdvanceLicense = addAdvanceLicense;
exports.addEInvoice = addEInvoice;
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
            const responce = yield __1.prisma.ePCGLicense.create({
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
