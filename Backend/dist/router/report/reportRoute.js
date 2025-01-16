"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const summaryControler_1 = require("../../controller/summary/summaryControler");
const router = (0, express_1.Router)();
router.post("/epcglicensesummary", summaryControler_1.addEpcgLicenseSummary);
exports.default = router;
