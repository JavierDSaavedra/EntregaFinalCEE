"use strict";
import { Router } from "express";
import { createRegistro, updateRegistro, deleteRegistro, getInformeRegistros } from "../controllers/Registros_Finanzas.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isCEE, isTesorero } from "../middleware/cee.middleware.js";




const router = Router();

router.use(authenticateJwt);
router.use(isCEE);
router.use(isTesorero);


router.post("/",isTesorero, createRegistro);
router.put("/",isTesorero, updateRegistro);
router.delete("/",isTesorero, deleteRegistro);


router.get("/", isCEE, getInformeRegistros);

export default router;