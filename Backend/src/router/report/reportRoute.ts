import { Router } from "express";
import { getIndirectExport, getDirectExport } from "../../controller/report/reportController";

const router = Router();

// Form Routes
router.get("/form/indirectexport", getIndirectExport);
router.get("/form/directexport", getDirectExport);

export default router;