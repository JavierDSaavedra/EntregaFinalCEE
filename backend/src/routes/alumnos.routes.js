import express from "express";
import { GetAlumnosByGeneracion, GetAlumnos } from "../controllers/generacion.controller.js";
import { isCEE } from "../middleware/cee.middleware.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js"; // Corrige el import

const router = express.Router();

router.use(authenticateJwt);
router.use(isCEE);           

router.get("/", GetAlumnos);
router.get("/:generacion", GetAlumnosByGeneracion);

export default router;