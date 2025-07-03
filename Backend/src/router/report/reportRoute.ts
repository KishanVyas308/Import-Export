import { Router } from "express";
import { getEpcgLicense , getIndirectExport, getDirectExport } from "../../controller/report/reportController";


const router = Router();

// Form Routes
router.get("/form/indirectexport", getIndirectExport);
router.get("/form/directexport", getDirectExport);

// Document Routes
router.get("/document/epcglicense", getEpcgLicense);
export default router;