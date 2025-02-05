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
exports.addNewExpoter = exports.addNewUser = void 0;
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
const addNewExpoter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, mobileNumber1, mobileNumber2, mobileNumber3, mailId1, mailId2, mailId3, firmPan, gstNo, iecNo, industryCategory, subIndustryCategory, iemUdyam, addedByUserId, } = req.body;
    try {
        const exporter = yield __1.prisma.client.create({
            data: {
                customerName: customerName || "",
                mobileNumber1: mobileNumber1 || "",
                mobileNumber2: mobileNumber2 || "",
                mobileNumber3: mobileNumber3 || "",
                mailId1: mailId1 || "",
                mailId2: mailId2 || "",
                mailId3: mailId3 || "",
                firmPan: firmPan || "",
                gstNo: gstNo || "",
                iecNo: iecNo || "",
                industryCategory: industryCategory || "",
                subIndustryCategory: subIndustryCategory || "",
                iemUdyam: iemUdyam || "",
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
