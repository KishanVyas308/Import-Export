import express from "express";

import indeirectexportRoute from "./components/indirectexportRoute"; 
import directexport from "./components/directexportRoute";   
import { getEInvoiceData, getEWayBillData } from "../../controller/forms/formsController";

const router = express.Router();

router.use("/indirectexport", indeirectexportRoute);
router.use("/directexport", directexport);


router.get('/einvoice', getEInvoiceData);
router.get('/ewaybill', getEWayBillData);

export default router;


