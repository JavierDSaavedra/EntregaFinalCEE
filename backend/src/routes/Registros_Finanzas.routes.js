"use strict";
import { Router } from "express";
import { createRegistro, updateRegistro, deleteRegistro, getInformeRegistros } from "../controllers/Registros_Finanzas.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";




const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);


router.post("/",isAdmin, createRegistro);
router.put("/",isAdmin, updateRegistro);
router.delete("/",isAdmin, deleteRegistro);


router.get("/", getInformeRegistros);

export default router;