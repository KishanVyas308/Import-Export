import { prisma } from "..";

interface filtersInterface {
    date?: {
        gte: Date;
        lte: Date;
    };
    exportersName?: {
        contains: string;
    };
    type?: {
        contains: string;
    };
    fobValue?: {
        gte: number;
        lte: number;
    };
}

async function directExportDataOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const BasicSheet = await prisma.basicSheet.findMany({
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

        const Annexure1 = await prisma.annexure1.findMany({
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

        const AnnexureA = await prisma.annexureA.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function indirectExportDataOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const BasicSheet = await prisma.indirectExportBasicSheet.findMany({
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
        const Annexure1 = await prisma.indirectExportAnneuxure1.findMany({
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
        const Annexure2 = await prisma.indirectExportAnneuxure2.findMany({
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
        const CalculationSheet = await prisma.indirectExportCalculationSheet.findMany({
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
        const NewDeptSheet = await prisma.indirectExportNewDeptSheet.findMany({
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
        const AnnexureA = await prisma.indirectExportAnneuxureA.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
async function shippingBillDataOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const Part1Section1 = await prisma.part1Section1.findMany({
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

        const Part1Section2 = await prisma.part1Section2.findMany({
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

     
    const Part1Section3 = await prisma.part1Section3.findMany({
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

    const Part2Section1 = await prisma.part2Section1.findMany({
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

    const Part2Section2 = await prisma.part2Section2.findMany({
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

    const Part2Section3 = await prisma.part2Section3.findMany({
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

    const Part3Section1 = await prisma.part3Section1.findMany({
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

    const Part3Section2 = await prisma.part3Section2.findMany({
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

    const Part3Section3 = await prisma.part3Section3.findMany({
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

    const Part4Section1 = await prisma.part4Section1.findMany({
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

    const Part4Section2 = await prisma.part4Section2.findMany({
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

    const Part4Section3 = await prisma.part4Section3.findMany({
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

    const Part4Section4 = await prisma.part4Section4.findMany({
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

    const Part4Section5 = await prisma.part4Section5.findMany({
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

    const Part4Section6 = await prisma.part4Section6.findMany({
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

    const Part5 = await prisma.part5.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function invoiceDataOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const Invoice = await prisma.invoice.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function ewayBillDataOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const EWayBill = await prisma.eWayBillDetails.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function epcgLicenceDataOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const EpcgLicense = await prisma.documentEpcgLicense.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}

async function ebrcOnDate(req: any, res: any) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(200).json({ selectDateError: 'Start date and end date are required' });
    }

    try {
        const Ebrc = await prisma.eBRC.findMany({
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
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}


export {  directExportDataOnDate, indirectExportDataOnDate, ewayBillDataOnDate, invoiceDataOnDate, shippingBillDataOnDate, epcgLicenceDataOnDate, ebrcOnDate };