import { prisma } from "../..";


async function getIndirectExport(req:any, res:any) {
    try {
        const { page = 1, limit = 50, search = "" } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Create search filter
        const searchFilter = search ? {
            OR: [
                { companyName: { contains: search } },
                { shippingBillNo: { contains: search } },
                { thirdPartyExporter: { contains: search } },
                { epcgLicNo: { contains: search } },
                { product: { contains: search } }
            ]
        } : {};

        const data: any = {}

        // Retrieve all indirect export tables with pagination
        const [basicSheet, basicSheetCount] = await Promise.all([
            prisma.indirectExportBasicSheet.findMany({
                where: searchFilter,
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: {
                    uploadedDate: 'desc'
                },
                skip,
                take
            }),
            prisma.indirectExportBasicSheet.count({ where: searchFilter })
        ]);

        const [annexure1, annexure1Count] = await Promise.all([
            prisma.indirectExportAnneuxure1.findMany({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } }
                    ]
                } : {},
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: {
                    uploadedDate: 'desc'
                },
                skip,
                take
            }),
            prisma.indirectExportAnneuxure1.count({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } }
                    ]
                } : {}
            })
        ]);

        const [annexure2, annexure2Count] = await Promise.all([
            prisma.indirectExportAnneuxure2.findMany({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } },
                        { taxInvoiceBillNo: { contains: search } }
                    ]
                } : {},
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: {
                    uploadedDate: 'desc'
                },
                skip,
                take
            }),
            prisma.indirectExportAnneuxure2.count({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } },
                        { taxInvoiceBillNo: { contains: search } }
                    ]
                } : {}
            })
        ]);

        const [calculationSheet, calculationSheetCount] = await Promise.all([
            prisma.indirectExportCalculationSheet.findMany({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } }
                    ]
                } : {},
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: {
                    uploadedDate: 'desc'
                },
                skip,
                take
            }),
            prisma.indirectExportCalculationSheet.count({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } }
                    ]
                } : {}
            })
        ]);

        const [newDeptSheet, newDeptSheetCount] = await Promise.all([
            prisma.indirectExportNewDeptSheet.findMany({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } },
                        { invoiceNo: { contains: search } }
                    ]
                } : {},
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: {
                    uploadedDate: 'desc'
                },
                skip,
                take
            }),
            prisma.indirectExportNewDeptSheet.count({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } },
                        { invoiceNo: { contains: search } }
                    ]
                } : {}
            })
        ]);

        const [annexureA, annexureACount] = await Promise.all([
            prisma.indirectExportAnneuxureA.findMany({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } },
                        { sameProductOrService: { contains: search } }
                    ]
                } : {},
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: {
                    uploadedDate: 'desc'
                },
                skip,
                take
            }),
            prisma.indirectExportAnneuxureA.count({
                where: search ? {
                    OR: [
                        { shippingBillNo: { contains: search } },
                        { sameProductOrService: { contains: search } }
                    ]
                } : {}
            })
        ]);

        // Organize data in response object
        data.indirectExportBasicSheet = {
            data: basicSheet,
            count: basicSheetCount,
            hasMore: skip + take < basicSheetCount
        };
        data.indirectExportAnnexure1 = {
            data: annexure1,
            count: annexure1Count,
            hasMore: skip + take < annexure1Count
        };
        data.indirectExportAnnexure2 = {
            data: annexure2,
            count: annexure2Count,
            hasMore: skip + take < annexure2Count
        };
        data.indirectExportCalculationSheet = {
            data: calculationSheet,
            count: calculationSheetCount,
            hasMore: skip + take < calculationSheetCount
        };
        data.indirectExportNewDeptSheet = {
            data: newDeptSheet,
            count: newDeptSheetCount,
            hasMore: skip + take < newDeptSheetCount
        };
        data.indirectExportAnnexureA = {
            data: annexureA,
            count: annexureACount,
            hasMore: skip + take < annexureACount
        };

        // Add pagination info
        data.pagination = {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            totalRecords: basicSheetCount + annexure1Count + annexure2Count + 
                         calculationSheetCount + newDeptSheetCount + annexureACount,
            hasMore: (skip + take < basicSheetCount) || 
                    (skip + take < annexure1Count) || 
                    (skip + take < annexure2Count) || 
                    (skip + take < calculationSheetCount) || 
                    (skip + take < newDeptSheetCount) || 
                    (skip + take < annexureACount)
        };

        res.status(200).json({
            success: true,
            message: "Indirect export data retrieved successfully",
            data: data
        });

    } catch (error) {
        console.error("Error retrieving indirect export data:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

async function getDirectExport(req: any, res: any) {
    try {
        const { page = 1, limit = 50, search = "" } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Create search filter for BasicSheet
        const basicSheetSearchFilter = search ? {
            OR: [
                { companyName: { contains: search } },
                { shippingBillNo: { contains: search } },
                { exportersName: { contains: search } },
                { epcgLicNo: { contains: search } },
                { product: { contains: search } },
                { srNo: { contains: search } },
                { hsCodeAndDescription: { contains: search } },
                { remarks: { contains: search } }
            ]
        } : {};

        // Create search filter for Annexure1
        const annexure1SearchFilter = search ? {
            OR: [
                { shippingBillNo: { contains: search } },
                { srNo: { contains: search } }
            ]
        } : {};

        // Create search filter for AnnexureA
        const annexureASearchFilter = search ? {
            OR: [
                { shippingBillNumber: { contains: search } },
                { productExportered: { contains: search } },
                { srNo: { contains: search } },
                { shippingBillDate: { contains: search } }
            ]
        } : {};

        const data: any = {}

        // Retrieve all records first (without pagination for consolidation)
        const [allBasicSheet, allAnnexure1, allAnnexureA] = await Promise.all([
            prisma.basicSheet.findMany({
                where: basicSheetSearchFilter,
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: { uploadedDate: 'desc' }
            }),
            prisma.annexure1.findMany({
                where: annexure1SearchFilter,
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: { uploadedDate: 'desc' }
            }),
            prisma.annexureA.findMany({
                where: annexureASearchFilter,
                include: {
                    user: {
                        select: {
                            email: true,
                            companyName: true,
                            contactPersonName: true
                        }
                    }
                },
                orderBy: { uploadedDate: 'desc' }
            })
        ]);

        // Create consolidated data by matching srNo
        const consolidatedData = new Map();

        // Process BasicSheet data
        allBasicSheet.forEach(item => {
            consolidatedData.set(item.srNo, {
                srNo: item.srNo,
                basicSheet: item,
                annexure1: null,
                annexureA: null,
                user: item.user,
                uploadedDate: item.uploadedDate
            });
        });

        // Add Annexure1 data
        allAnnexure1.forEach(item => {
            if (consolidatedData.has(item.srNo)) {
                consolidatedData.get(item.srNo).annexure1 = item;
            } else {
                consolidatedData.set(item.srNo, {
                    srNo: item.srNo,
                    basicSheet: null,
                    annexure1: item,
                    annexureA: null,
                    user: item.user,
                    uploadedDate: item.uploadedDate
                });
            }
        });

        // Add AnnexureA data
        allAnnexureA.forEach(item => {
            if (consolidatedData.has(item.srNo)) {
                consolidatedData.get(item.srNo).annexureA = item;
            } else {
                consolidatedData.set(item.srNo, {
                    srNo: item.srNo,
                    basicSheet: null,
                    annexure1: null,
                    annexureA: item,
                    user: item.user,
                    uploadedDate: item.uploadedDate
                });
            }
        });

        // Convert to array and sort by uploadedDate
        const consolidatedArray = Array.from(consolidatedData.values())
            .sort((a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime());

        // Apply pagination to consolidated data
        const totalRecords = consolidatedArray.length;
        const paginatedData = consolidatedArray.slice(skip, skip + take);

        // Organize data in response object
        data.consolidatedData = {
            data: paginatedData,
            count: totalRecords,
            hasMore: skip + take < totalRecords
        };

        // Individual table data for reference
        data.basicSheet = {
            data: allBasicSheet.slice(skip, skip + take),
            count: allBasicSheet.length,
            hasMore: skip + take < allBasicSheet.length
        };
        data.annexure1 = {
            data: allAnnexure1.slice(skip, skip + take),
            count: allAnnexure1.length,
            hasMore: skip + take < allAnnexure1.length
        };
        data.annexureA = {
            data: allAnnexureA.slice(skip, skip + take),
            count: allAnnexureA.length,
            hasMore: skip + take < allAnnexureA.length
        };

        // Add pagination info
        data.pagination = {
            currentPage: parseInt(page),
            limit: parseInt(limit),
            totalRecords: totalRecords,
            hasMore: skip + take < totalRecords
        };

        res.status(200).json({
            success: true,
            message: "Direct export data retrieved successfully",
            data: data
        });

    } catch (error) {
        console.error("Error retrieving direct export data:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export { getIndirectExport, getDirectExport };