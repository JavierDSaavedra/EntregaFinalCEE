"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createPregunta, getPreguntas, updatePregunta, deletePregunta } from "../controllers/pregunta.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas para usuarios
router.get("/", getPreguntas);

// Rutas para administradores
router.post("/", isAdmin, createPregunta);
router.put("/:id", isAdmin, updatePregunta);
router.delete("/:id", isAdmin, deletePregunta);

export default router;