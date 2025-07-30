import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createVotacion, getVotaciones, deleteVotacion, updateVotacion, getVotacionesByEstado } from "../controllers/votacion.controller.js";
import { isCEE } from "../middleware/cee.middleware.js";

const router = Router();


router.use(authenticateJwt);

//usuario
router.get("/", getVotaciones);
router.get("/estado/:estado", getVotacionesByEstado);

//para admin cee
router.post("/",isCEE, createVotacion);
router.delete("/:id", isCEE, deleteVotacion);
router.put("/:id", isCEE, updateVotacion);


export default router;