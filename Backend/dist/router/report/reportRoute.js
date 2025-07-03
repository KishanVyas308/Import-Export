"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../../controller/report/reportController");
const router = (0, express_1.Router)();
// Form Routes
router.get("/form/indirectexport", reportController_1.getIndirectExport);
router.get("/form/directexport", reportController_1.getDirectExport);
// Document Routes
router.get("/document/epcglicense", reportController_1.getEpcgLicense);
exports.default = router;
