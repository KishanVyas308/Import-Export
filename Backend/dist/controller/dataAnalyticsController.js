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
exports.directExportDataOnDate = directExportDataOnDate;
exports.indirectExportDataOnDate = indirectExportDataOnDate;
exports.ewayBillDataOnDate = ewayBillDataOnDate;
exports.invoiceDataOnDate = invoiceDataOnDate;
exports.shippingBillDataOnDate = shippingBillDataOnDate;
exports.epcgLicenceDataOnDate = epcgLicenceDataOnDate;
exports.ebrcOnDate = ebrcOnDate;
const __1 = require("..");
function directExportDataOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const BasicSheet = yield __1.prisma.basicSheet.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Annexure1 = yield __1.prisma.annexure1.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const AnnexureA = yield __1.prisma.annexureA.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const result = {
                BasicSheet,
                Annexure1,
                AnnexureA
            };
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
function indirectExportDataOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const BasicSheet = yield __1.prisma.indirectExportBasicSheet.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Annexure1 = yield __1.prisma.indirectExportAnneuxure1.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Annexure2 = yield __1.prisma.indirectExportAnneuxure2.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const CalculationSheet = yield __1.prisma.indirectExportCalculationSheet.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const NewDeptSheet = yield __1.prisma.indirectExportNewDeptSheet.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const AnnexureA = yield __1.prisma.indirectExportAnneuxureA.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const result = {
                BasicSheet,
                Annexure1,
                Annexure2,
                CalculationSheet,
                NewDeptSheet,
                AnnexureA
            };
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
function shippingBillDataOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const Part1Section1 = yield __1.prisma.part1Section1.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part1Section2 = yield __1.prisma.part1Section2.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part1Section3 = yield __1.prisma.part1Section3.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part2Section1 = yield __1.prisma.part2Section1.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part2Section2 = yield __1.prisma.part2Section2.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part2Section3 = yield __1.prisma.part2Section3.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part3Section1 = yield __1.prisma.part3Section1.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part3Section2 = yield __1.prisma.part3Section2.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part3Section3 = yield __1.prisma.part3Section3.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part4Section1 = yield __1.prisma.part4Section1.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part4Section2 = yield __1.prisma.part4Section2.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part4Section3 = yield __1.prisma.part4Section3.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part4Section4 = yield __1.prisma.part4Section4.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part4Section5 = yield __1.prisma.part4Section5.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part4Section6 = yield __1.prisma.part4Section6.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const Part5 = yield __1.prisma.part5.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const data = {
                Part1Section1,
                Part1Section2,
                Part1Section3,
                Part2Section1,
                Part2Section2,
                Part2Section3,
                Part3Section1,
                Part3Section2,
                Part3Section3,
                Part4Section1,
                Part4Section2,
                Part4Section3,
                Part4Section4,
                Part4Section5,
                Part4Section6,
                Part5
            };
            res.json(data);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
function invoiceDataOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const Invoice = yield __1.prisma.invoice.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            const result = {
                Invoice
            };
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
function ewayBillDataOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const EWayBill = yield __1.prisma.eWayBillDetails.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            res.json({
                EWayBill
            });
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
function epcgLicenceDataOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const EpcgLicense = yield __1.prisma.documentEpcgLicense.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            res.json({
                EpcgLicense
            });
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
function ebrcOnDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(200).json({ selectDateError: 'Start date and end date are required' });
        }
        try {
            const Ebrc = yield __1.prisma.eBRC.findMany({
                where: {
                    uploadedDate: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
                orderBy: {
                    uploadedDate: 'desc',
                },
            });
            res.json({
                Ebrc
            });
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });
}
