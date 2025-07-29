"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { getRespuestas, updateRespuesta, createRespuesta, deleteRespuesta,  } from "../controllers/respuesta.controller.js";
import { validateRespuesta } from "../middleware/respuesta.middleware.js";


const router = Router();

router.use(authenticateJwt);
router.use(validateRespuesta);

// Rutas para usuarios

router.get("/", getRespuestas);
router.post("/", createRespuesta);
router.put("/:id", updateRespuesta);




router.delete("/:id", deleteRespuesta);

export default router;

