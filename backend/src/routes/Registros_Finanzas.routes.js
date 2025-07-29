"use strict";
import { Router } from "express";
import { createRegistro, updateRegistro, deleteRegistro, getInformeRegistros } from "../controllers/Registros_Finanzas.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isCEE, isTesorero } from "../middleware/cee.middleware.js";

const router = Router();

// Solo aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas que requieren ser Tesorero específicamente
router.post("/", isTesorero, createRegistro);
router.put("/", isTesorero, updateRegistro);
router.delete("/", isTesorero, deleteRegistro);

// Ruta que requiere ser CEE (presidente, secretario o tesorero)
router.get("/", isCEE, getInformeRegistros);

export default router;