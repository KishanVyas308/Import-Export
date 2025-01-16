import { Router } from "express";
import { addEpcgLicenseSummary } from "../../controller/summary/summaryControler";

const router = Router();

router.post("/epcglicensesummary", addEpcgLicenseSummary)

export default router;
