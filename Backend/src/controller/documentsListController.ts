import { create } from "domain";
import { prisma } from "..";

export async function addInvoice(req: any, res: any) {
  try {
    const { productDetails, ...InvoiceData } = req.body;
    const response = await prisma.invoice.create({
      data: {
        ...InvoiceData,
        productDetails: {
          create: productDetails,
        },
      },
    });
    return res.json({ message: "Added successfully", response });
  } catch (e) {
    console.log(e);
    return res.json({ message: e });
  }
}

export async function addEWayBill(req: any, res: any) {
  try {
    const responce = await prisma.eWayBillDetails.create({
      data: req.body,
    });
  } catch (e) {
    return res.json({ message: e });
  }

  return res.json({ message: "Added successfully" });
}

export async function addEpcgLicense(req: any, res: any) {
  try {
    const { DocumentEpcgLicenseEoAsPerLicense, DocumentEpcgLicenseActualExport, ...epcgLicenseDetails } = req.body;

    const response = await prisma.documentEpcgLicense.create({
      data: {
        ...epcgLicenseDetails,
        DocumentEpcgLicenseEoAsPerLicense: {
          create: DocumentEpcgLicenseEoAsPerLicense,
        },
        DocumentEpcgLicenseActualExport: {
          create: DocumentEpcgLicenseActualExport,
        },
      },
    });

    console.log("Response from EPCG License creation:", response);
    

    return res.json({ message: "Added successfully", response });
  } catch (e) {
    console.log(e);
    return res.json({ message: e });
  }
}

export async function getEpcgLicense(req: any, res: any) {
  try {
    const { srNo } = req.query;
    
    if (!srNo) {
      return res.status(400).json({ message: "Sr No is required" });
    }

    const epcgLicense = await prisma.documentEpcgLicense.findFirst({
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export async function addEbrc(req: any, res: any) {
  try {
    const responce = await prisma.eBRC.create({
      data: req.body,
    });
  } catch (e) {
    console.log(e);
    
    return res.json({ message: e });
  }

  return res.json({ message: "Added successfully" });
}

export async function addAdvanceLicense(req: any, res: any) {
  try {
    
    const responce = await prisma.advanceLicense.create({
      data: req.body,
    });
  } catch (e) {
    console.log(e);
    
    return res.json({ message: e });
  }

  return res.json({ message: "Added successfully" });
}


export async function addEInvoice(req: any, res: any) {
  try {
    const { productDetails, ...eInvoiceData } = req.body;

    const eInvoice = await prisma.eInvoice.create({
      data: {
        ...eInvoiceData,
        productDetails: {
          create: productDetails,
        },
      },
    });
    

    return res.json({ message: "Added successfully", eInvoice });
  } catch (e) {
    console.log(e);
    return res.json({ message: e });
  }
}

export async function updateEpcgLicense(req: any, res: any) {
  try {
    const { DocumentEpcgLicenseEoAsPerLicense, DocumentEpcgLicenseActualExport, srNo, ...epcgLicenseDetails } = req.body;

    if (!srNo) {
      return res.status(400).json({ message: "Sr No is required for update" });
    }

    // Check if the record exists
    const existingLicense = await prisma.documentEpcgLicense.findFirst({
      where: { srNo: srNo }
    });

    if (!existingLicense) {
      return res.status(404).json({ message: "EPCG License not found" });
    }

    // First, delete existing related records
    await prisma.documentEpcgLicenseEoAsPerLicense.deleteMany({
      where: { epcgLicenseId: existingLicense.id }
    });

    await prisma.documentEpcgLicenseActualExport.deleteMany({
      where: { epcgLicenseId: existingLicense.id }
    });

    // Update the main record and create new related records
    const response = await prisma.documentEpcgLicense.update({
      where: { id: existingLicense.id },
      data: {
        ...epcgLicenseDetails,
        srNo: srNo,
        DocumentEpcgLicenseEoAsPerLicense: {
          create: DocumentEpcgLicenseEoAsPerLicense || []
        },
        DocumentEpcgLicenseActualExport: {
          create: DocumentEpcgLicenseActualExport || []
        },
      },
      include: {
        DocumentEpcgLicenseEoAsPerLicense: true,
        DocumentEpcgLicenseActualExport: true,
      }
    });

    console.log("Response from EPCG License update:", response);
    
    return res.json({ 
      message: "Updated successfully", 
      data: response 
    });
  } catch (e) {
    console.log("Error updating EPCG License:", e);
    return res.status(500).json({ 
      message: "Error updating EPCG License", 
      error: e 
    });
  }
}