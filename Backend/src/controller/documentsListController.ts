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
    const responce = await prisma.ePCGLicense.create({
      data: req.body,
    });
  } catch (e) {
    console.log(e);
    
    return res.json({ message: e });
  }

  return res.json({ message: "Added successfully" });
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