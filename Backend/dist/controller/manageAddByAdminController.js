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
exports.deleteExpoter = exports.updateExpoter = exports.addNewExpoter = exports.getAllExporters = exports.addNewUser = void 0;
const __1 = require("..");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, contactPersonName, companyName, addressLine1, addressLine2, city, state, country, pin, webpage, phoneNumber, gstNo, companyLogo, role, } = req.body;
    try {
        const user = yield __1.prisma.user.create({
            data: {
                email,
                password: yield bcryptjs_1.default.hash(password, 10),
                contactPersonName,
                companyName,
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                pin,
                webpage,
                phoneNumber,
                gstNo,
                companyLogo,
                role,
            },
        });
        return res.status(200).json({
            message: "User added successfully",
        });
    }
    catch (error) {
        return res.json({ message: "Please try again later" + error });
    }
});
exports.addNewUser = addNewUser;
// Expoter Functions
// Get all exporters
const getAllExporters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exporters = yield __1.prisma.client.findMany({});
        return res.status(200).json(exporters);
    }
    catch (error) {
        return res.json({ message: "Please try again later" + error });
    }
});
exports.getAllExporters = getAllExporters;
// Add a new exporter
const addNewExpoter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, resource, dgftCategory, gstCategory, mainCategory, industry, subIndustry, department, freshService, eodcService, basicService, otherDgftService, gstService, mobileNumber1, contactPersonName1, mobileNumber2, contactPersonName2, mailId1, mailId2, address, addedByUserId, } = req.body;
    try {
        const exporter = yield __1.prisma.client.create({
            data: {
                customerName: customerName || "",
                resource: resource || "",
                dgftCategory: dgftCategory || "",
                gstCategory: gstCategory || "",
                mainCategory: mainCategory || "",
                industry: industry || "",
                subIndustry: subIndustry || "",
                department: department || "",
                freshService: freshService || "",
                eodcService: eodcService || "",
                basicService: basicService || "",
                otherDgftService: otherDgftService || "",
                gstService: gstService || "",
                mobileNumber1: mobileNumber1 || "",
                contactPersonName1: contactPersonName1 || "",
                mobileNumber2: mobileNumber2 || "",
                contactPersonName2: contactPersonName2 || "",
                mailId1: mailId1 || "",
                mailId2: mailId2 || "",
                address: address || "",
                addedByUserId: addedByUserId || "",
            },
        });
        return res.status(200).json({
            message: "Exporter added successfully",
        });
    }
    catch (error) {
        return res.json({ message: "Please try again later" + error });
    }
});
exports.addNewExpoter = addNewExpoter;
// Update an existing exporter
const updateExpoter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { customerName, resource, dgftCategory, gstCategory, mainCategory, industry, subIndustry, department, freshService, eodcService, basicService, otherDgftService, gstService, mobileNumber1, contactPersonName1, mobileNumber2, contactPersonName2, mailId1, mailId2, address, } = req.body;
    try {
        const exporter = yield __1.prisma.client.update({
            where: { id: id },
            data: {
                customerName: customerName || "",
                resource: resource || "",
                dgftCategory: dgftCategory || "",
                gstCategory: gstCategory || "",
                mainCategory: mainCategory || "",
                industry: industry || "",
                subIndustry: subIndustry || "",
                department: department || "",
                freshService: freshService || "",
                eodcService: eodcService || "",
                basicService: basicService || "",
                otherDgftService: otherDgftService || "",
                gstService: gstService || "",
                mobileNumber1: mobileNumber1 || "",
                contactPersonName1: contactPersonName1 || "",
                mobileNumber2: mobileNumber2 || "",
                contactPersonName2: contactPersonName2 || "",
                mailId1: mailId1 || "",
                mailId2: mailId2 || "",
                address: address || "",
            },
        });
        return res.status(200).json({
            message: "Exporter updated successfully",
            exporter,
        });
    }
    catch (error) {
        return res.json({ message: "Please try again later" + error });
    }
});
exports.updateExpoter = updateExpoter;
const deleteExpoter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield __1.prisma.client.delete({
            where: { id: id },
        });
        return res.status(200).json({
            message: "Exporter deleted successfully",
        });
    }
    catch (error) {
        return res.json({ message: "Please try again later" + error });
    }
});
exports.deleteExpoter = deleteExpoter;
