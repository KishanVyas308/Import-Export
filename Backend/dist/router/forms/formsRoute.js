"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indirectexportRoute_1 = __importDefault(require("./components/indirectexportRoute"));
const directexportRoute_1 = __importDefault(require("./components/directexportRoute"));
const formsController_1 = require("../../controller/forms/formsController");
const router = express_1.default.Router();
router.use("/indirectexport", indirectexportRoute_1.default);
router.use("/directexport", directexportRoute_1.default);
router.get('/einvoice', formsController_1.getEInvoiceData);
router.get('/ewaybill', formsController_1.getEWayBillData);
exports.default = router;
