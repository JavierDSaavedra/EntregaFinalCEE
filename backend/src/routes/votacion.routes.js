"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createVotacion, getVotaciones, deleteVotacion,updateVotacion, getVotacionesByEstado} from "../controllers/votacion.controller.js";

const router = Router();


router.use(authenticateJwt);

//usuario
router.get("/", getVotaciones);
router.get("/estado/:estado", getVotacionesByEstado);

//para admin cee
router.post("/",isAdmin, createVotacion);
router.delete("/:id", isAdmin, deleteVotacion);
router.put("/:id", isAdmin, updateVotacion);


export default router;