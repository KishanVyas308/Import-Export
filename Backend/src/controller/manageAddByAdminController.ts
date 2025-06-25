import { prisma } from "..";
import bcrypt from "bcryptjs";

export const addNewUser = async (req: any, res: any) => {
  const {
    email,
    password,
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
  } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
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
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};

// Expoter Functions

// Get all exporters
export const getAllExporters = async (req: any, res: any) => {
  try {
    const exporters = await prisma.client.findMany();

    return res.status(200).json(exporters);
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};

// Add a new exporter

export const addNewExpoter = async (req: any, res: any) => {
  const {
    customerName,
    resource,
    dgftCategory,
    gstCategory,
    mainCategory,
    industry,
    subIndustry,
    department,
    freshService,
    eodcService,
    basicService,
    otherDgftService,
    gstService,
    mobileNumber1,
    contactPersonName1,
    mobileNumber2,
    contactPersonName2,
    mailId1,
    mailId2,
    address,
    addedByUserId,
  } = req.body;

  try {
    const exporter = await prisma.client.create({
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
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};

// Update an existing exporter
export const updateExpoter = async (req: any, res: any) => {
  const { id } = req.params;
  const {
    customerName,
    resource,
    dgftCategory,
    gstCategory,
    mainCategory,
    industry,
    subIndustry,
    department,
    freshService,
    eodcService,
    basicService,
    otherDgftService,
    gstService,
    mobileNumber1,
    contactPersonName1,
    mobileNumber2,
    contactPersonName2,
    mailId1,
    mailId2,
    address,
  } = req.body;

  try {
    const exporter = await prisma.client.update({
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
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};


export const deleteExpoter = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    await prisma.client.delete({
      where: { id: id },
    });

    return res.status(200).json({
      message: "Exporter deleted successfully",
    });
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};
