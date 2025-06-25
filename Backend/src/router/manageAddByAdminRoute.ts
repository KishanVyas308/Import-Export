import express from 'express';
import {addNewExpoter, addNewUser, deleteExpoter, getAllExporters, updateExpoter } from '../controller/manageAddByAdminController';
import { isAdmin } from '../middleWare';

const router = express.Router();

router.post('/user' , isAdmin , addNewUser);


router.get('/exporter', getAllExporters);
router.post('/exporter', isAdmin, addNewExpoter);
router.put('/exporter/:id', isAdmin, updateExpoter);
router.delete('/exporter/:id', isAdmin, deleteExpoter);


export default router;