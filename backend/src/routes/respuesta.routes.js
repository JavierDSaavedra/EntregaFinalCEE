import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { getRespuestas, updateRespuesta, createRespuesta, deleteRespuesta, getResultadosPregunta } from "../controllers/respuesta.controller.js";
import { validateRespuesta } from "../middleware/respuesta.middleware.js";


const router = Router();


router.use(authenticateJwt);


router.post("/", validateRespuesta, createRespuesta);
router.put("/:id", validateRespuesta, updateRespuesta);

router.get("/", getRespuestas);
router.get("/resultados/:preguntaId", getResultadosPregunta);
router.delete("/:id", deleteRespuesta);

export default router;

