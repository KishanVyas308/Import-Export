"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manageAddByAdminController_1 = require("../controller/manageAddByAdminController");
const middleWare_1 = require("../middleWare");
const router = express_1.default.Router();
router.post('/user', middleWare_1.isAdmin, manageAddByAdminController_1.addNewUser);
router.get('/exporter', manageAddByAdminController_1.getAllExporters);
router.post('/exporter', middleWare_1.isAdmin, manageAddByAdminController_1.addNewExpoter);
router.put('/exporter/:id', middleWare_1.isAdmin, manageAddByAdminController_1.updateExpoter);
router.delete('/exporter/:id', middleWare_1.isAdmin, manageAddByAdminController_1.deleteExpoter);
exports.default = router;
