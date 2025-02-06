import { Router } from "express";
import { addHSCodeFromLocal } from "../controller/temp/tempHSCodeAddScript";

const router = Router();

router.get("/add/hscode", addHSCodeFromLocal);

export default router;
