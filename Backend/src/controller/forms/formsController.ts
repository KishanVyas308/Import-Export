import { prisma } from "../..";

export const getEInvoiceData = async (req: any, res: any) => {
  try {
    const data = await prisma.eInvoice.findMany({
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
  } catch (error) {
    console.error("Error fetching eInvoice data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } 
}

export const getEInvoiceById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = await prisma.eInvoice.findUnique({
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
  } catch (error) {
    console.error("Error fetching eInvoice by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getEWayBillData = async (req: any, res: any) => {
  try {
    const data = await prisma.eWayBillDetails.findMany({
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
  } catch (error) {
    console.error("Error fetching eWayBill data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getEWayBillById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = await prisma.eWayBillDetails.findUnique({
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
  } catch (error) {
    console.error("Error fetching eWayBill by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
