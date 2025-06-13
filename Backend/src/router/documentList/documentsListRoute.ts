import express from "express";
import { addEWayBill,addInvoice, addEpcgLicense, getEpcgLicense, addEbrc, addAdvanceLicense, addEInvoice  } from "../../controller/documentsListController";

import shippingBillRoute from "./shippingBillRoute";

const router = express.Router();

router.post("/invoice", addInvoice )
router.post("/ewaybilldetails",  addEWayBill )
router.use("/shippingbill", shippingBillRoute)
router.post("/epcglicense", addEpcgLicense)
router.get("/epcglicense", getEpcgLicense)

router.post("/ebrc", addEbrc)
router.post("/advancelicense", addAdvanceLicense)
router.post("/einvoice", addEInvoice)


export default router;
