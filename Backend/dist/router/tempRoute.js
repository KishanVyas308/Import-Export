"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tempHSCodeAddScript_1 = require("../controller/temp/tempHSCodeAddScript");
const router = (0, express_1.Router)();
router.get("/add/hscode", tempHSCodeAddScript_1.addHSCodeFromLocal);
exports.default = router;
