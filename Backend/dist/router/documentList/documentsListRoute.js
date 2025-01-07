"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentsListController_1 = require("../../controller/documentsListController");
const shippingBillRoute_1 = __importDefault(require("./shippingBillRoute"));
const router = express_1.default.Router();
router.post("/invoice", documentsListController_1.addInvoice);
router.post("/ewaybilldetails", documentsListController_1.addEWayBill);
router.use("/shippingbill", shippingBillRoute_1.default);
router.post("/epcglicense", documentsListController_1.addEpcgLicense);
router.post("/ebrc", documentsListController_1.addEbrc);
router.post("/advancelicense", documentsListController_1.addAdvanceLicense);
router.post("/einvoice", documentsListController_1.addEInvoice);
exports.default = router;
