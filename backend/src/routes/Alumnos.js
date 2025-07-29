import express from "express";
import { GetAlumnosByGeneracion, GetAlumnos}   from "../controllers/generacion.controller.js";
import { isCEE } from "../middleware/cee.middleware.js";


const router = express.Router();
router.use(isCEE);

router.get("/:id", isCEE, GetAlumnosByGeneracion);
router.get("/", isCEE, GetAlumnos);

export default router;