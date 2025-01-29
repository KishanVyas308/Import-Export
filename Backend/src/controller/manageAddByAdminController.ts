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

export const addNewExpoter = async (req: any, res: any) => {
const {
  customerName,
  mobileNumber1,
  mobileNumber2,
  mobileNumber3,
  mailId1,
  mailId2,
  mailId3,
  firmPan,
  gstNo,
  iecNo,
  industryCategory,
  subIndustryCategory,
  iemUdyam,
  addedByUserId,
} = req.body;


try {
  const exporter = await prisma.client.create({
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
} catch (error) {
  return res.json({ message: "Please try again later" + error });
}
}