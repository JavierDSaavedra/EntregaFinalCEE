import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createPregunta, getPreguntas, updatePregunta, deletePregunta } from "../controllers/pregunta.controller.js";
import { isCEE } from "../middleware/cee.middleware.js";

const router = Router();


router.use(authenticateJwt);

// Rutas para usuarios (todos los autenticados pueden ver preguntas)
router.get("/", getPreguntas);

// Rutas para CEE
router.post("/", isCEE, createPregunta);
router.put("/:id", isCEE, updatePregunta);
router.delete("/:id", isCEE, deletePregunta);

export default router;