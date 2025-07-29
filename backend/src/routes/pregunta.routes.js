"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createPregunta, getPreguntas, updatePregunta, deletePregunta } from "../controllers/pregunta.controller.js";
import { isCEE } from "../middleware/cee.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.use(isCEE);

// Rutas para usuarios
router.get("/", getPreguntas);

// Rutas para administradores
router.post("/", isCEE, createPregunta);
router.put("/:id", isCEE, updatePregunta);
router.delete("/:id", isCEE, deletePregunta);

export default router;