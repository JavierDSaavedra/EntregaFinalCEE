import express from "express";
import { GetAlumnosByGeneracion, GetAlumnos } from "../controllers/generacion.controller.js";
import { isCEE } from "../middleware/cee.middleware.js";

const router = express.Router();
router.use(isCEE);

// IMPORTANTE: La ruta más específica debe ir ANTES que la genérica
router.get("/", GetAlumnos);
router.get("/:generacion", GetAlumnosByGeneracion);

export default router;