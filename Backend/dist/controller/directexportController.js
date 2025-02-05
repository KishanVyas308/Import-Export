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
exports.addBasicSheet = addBasicSheet;
exports.addAnnexure1 = addAnnexure1;
exports.addAnnexureA = addAnnexureA;
exports.getSummary = getSummary;
const __1 = require("..");
function addBasicSheet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { basicSheet, addedByUserId } = req.body;
            const { companyName, srNo, shippingBillNo, shippingBillDate, exportersName, hsCodeAndDescription, epcgLicNo, cifValue, freight, insurance, brc, exchangeRateOrProprtionRatio, exchangeRate, product, remarks, cifValue2, freight2, insurance2, brc2, } = basicSheet;
            const basicSheet1 = yield __1.prisma.basicSheet.create({
                data: {
                    companyName: companyName,
                    srNo: srNo,
                    shippingBillNo: shippingBillNo,
                    shippingBillDate: shippingBillDate,
                    exportersName: exportersName,
                    hsCodeAndDescription: hsCodeAndDescription,
                    epcgLicNo: epcgLicNo,
                    cifValue: cifValue,
                    freight: freight,
                    insurance: insurance,
                    brc: brc,
                    exchangeRateOrProprtionRatio: exchangeRateOrProprtionRatio,
                    cifValue2: cifValue2,
                    freight2: freight2,
                    insurance2: insurance2,
                    brc2: brc2,
                    exchangeRate: exchangeRate,
                    product: product,
                    remarks: remarks,
                    addedByUserId: addedByUserId,
                },
            });
            return res.status(200).json({ message: "Added data successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error adding basic sheet" });
        }
    });
}
function addAnnexure1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { annexure1, addedByUserId } = req.body;
            const { srNo, shippingBillNo, shippingBillDate, shippingBillCifValueInDoller, brcValue, 
            // Lower of SB and BRC
            lowerOfSbAndBrc, shippingBillFreight, shippingBillInsurance, fobValueInDoller, ExchangeRatePerShippingBill, fobValueInRupees, } = annexure1;
            const Annexure1 = yield __1.prisma.annexure1.create({
                data: {
                    srNo: srNo,
                    shippingBillNo: shippingBillNo,
                    shippingBillDate: shippingBillDate,
                    shippingBillCifValueInDoller: shippingBillCifValueInDoller,
                    brcValue: brcValue,
                    lowerOfSbAndBrc: lowerOfSbAndBrc,
                    shippingBillFreight: shippingBillFreight,
                    shippingBillInsurance: shippingBillInsurance,
                    fobValueInDoller: fobValueInDoller,
                    ExchangeRatePerShippingBill: ExchangeRatePerShippingBill,
                    fobValueInRupees: fobValueInRupees,
                    addedByUserId: addedByUserId,
                },
            });
            return res.status(200).json({ message: "Added data successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error adding annexure 1" });
        }
    });
}
function addAnnexureA(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { annexureA, addedByUserId } = req.body;
            const { srNo, productExportered, shippingBillNumber, shippingBillDate, directExportsInRupees, directExportsInDollars, deemedExports, thirdPartyExportsInRupees, thirdPartyExportsInDollars, byGroupCompany, otherRWseries, totalInRupees, totalInDollars, } = annexureA;
            const AnnexureA = yield __1.prisma.annexureA.create({
                data: {
                    srNo,
                    productExportered,
                    shippingBillNumber,
                    shippingBillDate,
                    directExportsInRupees,
                    directExportsInDollars,
                    deemedExports,
                    thirdPartyExportsInRupees,
                    thirdPartyExportsInDollars,
                    byGroupCompany,
                    otherRWseries,
                    totalInRupees,
                    totalInDollars,
                    addedByUserId: addedByUserId,
                },
            });
            return res.status(200).json({ message: "Added data successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error adding annexure A" });
        }
    });
}
function getSummary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const annexureA = yield __1.prisma.annexureA.findMany({
                select: {
                    directExportsInDollars: true,
                },
            });
            // const totalDirectExportsInDollars = annexureA.reduce((sum, record) => {
            //   return sum + parseFloat(record.directExportsInDollars);
            // }, 0);
            let totalDirectExportsInDollars = 0;
            annexureA.forEach((record) => {
                if (record.directExportsInDollars.trim() != "")
                    totalDirectExportsInDollars += parseFloat(record.directExportsInDollars);
            });
            const EOImposed = "1340782";
            const DirectExport = totalDirectExportsInDollars;
            const IndirectExport = "0";
            const Total = Number(DirectExport) + Number(IndirectExport);
            const Excess = Number(Total) - Number(EOImposed);
            const EOFulfilled = (Number(Total) / Number(EOImposed)) * 100;
            const ExcessEo = (Number(Excess) / Number(EOImposed)) * 100;
            const summary = {
                EOImposed,
                DirectExport,
                IndirectExport,
                Total,
                Excess,
                EOFulfilled,
                ExcessEo,
            };
            return res.status(200).json({
                message: "Fetched summary successfully",
                summary,
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Error fetching summary" });
        }
    });
}
