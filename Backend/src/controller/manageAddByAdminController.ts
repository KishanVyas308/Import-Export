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
    const exporters = await prisma.client.findMany({
      include: {
        turnover: true
      }
    });

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
    turnoverData,
    clientJoiningDate,
    ReferanceClient,
    ReferanceClientId
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
        clientJoiningDate: clientJoiningDate ? new Date(clientJoiningDate) : new Date(),
        ReferanceClient: ReferanceClient || false,
        ReferanceClientId: ReferanceClientId || null,
        addedByUserId,
        turnover: turnoverData ? {
          create: turnoverData.map((data: any) => ({
            financialYear: data.financialYear,
            domesticTurnover: data.domesticTurnover,
            directExportTurnover: data.directExportTurnover,
            merchantExportTurnover: data.merchantExportTurnover,
          }))
        } : undefined,
      },
    });

    return res.status(200).json({
      message: "Exporter added successfully",
      exporter,
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
    turnoverData,
    clientJoiningDate,
    ReferanceClient,
    ReferanceClientId
  } = req.body;

  try {
    const exporter = await prisma.client.update({
      where: { id },
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
        clientJoiningDate: clientJoiningDate ? new Date(clientJoiningDate) : undefined,
        ReferanceClient: ReferanceClient !== undefined ? ReferanceClient : undefined,
        ReferanceClientId: ReferanceClientId !== undefined ? ReferanceClientId : undefined,
      },
      include: {
        turnover: true,
      },
    });

    // Handle turnover data - this includes add, update, and delete operations
    if (turnoverData !== undefined) {
      // Get existing turnover IDs for this client
      const existingTurnover = await prisma.clientTurnover.findMany({
        where: { clientId: id },
        select: { id: true }
      });
      
      const existingIds = existingTurnover.map(t => t.id);
      const incomingIds = turnoverData
        .filter((data: any) => data.id)
        .map((data: any) => data.id);
      
      // Delete turnover entries that are no longer present
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
        await prisma.clientTurnover.deleteMany({
          where: {
            id: { in: idsToDelete }
          }
        });
      }
      
      // Update or create turnover entries
      for (const data of turnoverData) {
        if (data.id) {
          // Update existing turnover
          await prisma.clientTurnover.update({
            where: { id: data.id },
            data: {
              financialYear: data.financialYear,
              domesticTurnover: data.domesticTurnover,
              directExportTurnover: data.directExportTurnover,
              merchantExportTurnover: data.merchantExportTurnover,
            },
          });
        } else {
          // Create new turnover
          await prisma.clientTurnover.create({
            data: {
              financialYear: data.financialYear,
              domesticTurnover: data.domesticTurnover,
              directExportTurnover: data.directExportTurnover,
              merchantExportTurnover: data.merchantExportTurnover,
              clientId: id,
            },
          });
        }
      }
    } else {
      // If turnoverData is null/undefined, delete all existing turnover data
      await prisma.clientTurnover.deleteMany({
        where: { clientId: id }
      });
    }

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
    // Delete all related turnover records first
    await prisma.clientTurnover.deleteMany({
      where: { clientId: id },
    });

    // Then delete the client
    await prisma.client.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Exporter deleted successfully",
    });
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};

// Manage client turnover data
export const manageClientTurnover = async (req: any, res: any) => {
  const { clientId } = req.params;
  const { turnoverData } = req.body;

  try {
    const results = [];
    
    for (const data of turnoverData) {
      if (data.id) {
        const updated = await prisma.clientTurnover.update({
          where: { id: data.id },
          data: {
            financialYear: data.financialYear,
            domesticTurnover: data.domesticTurnover,
            directExportTurnover: data.directExportTurnover,
            merchantExportTurnover: data.merchantExportTurnover,
          },
        });
        results.push(updated);
      } else {
        const created = await prisma.clientTurnover.create({
          data: {
            financialYear: data.financialYear,
            domesticTurnover: data.domesticTurnover,
            directExportTurnover: data.directExportTurnover,
            merchantExportTurnover: data.merchantExportTurnover,
            clientId,
          },
        });
        results.push(created);
      }
    }

    return res.status(200).json({
      message: "Turnover data updated successfully",
      data: results,
    });
  } catch (error) {
    return res.json({ message: "Please try again later" + error });
  }
};
