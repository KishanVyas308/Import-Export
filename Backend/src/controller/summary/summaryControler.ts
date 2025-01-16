import { prisma } from "../..";

export async function addEpcgLicenseSummary(req: any, res: any) {
  try {
    const responce = await prisma.ePCGLicenseSummary.create({
      data: req.body,
    });
  } catch (e) {
    console.log(e);
    
    return res.json({ message: e });
  }

  return res.json({ message: "Added successfully" });
}