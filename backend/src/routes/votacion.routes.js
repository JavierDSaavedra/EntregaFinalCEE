import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { createVotacion, getVotaciones, deleteVotacion, updateVotacion } from "../controllers/votacion.controller.js";
import { isCEE } from "../middleware/authorization.middleware.js";

const router = Router();


router.use(authenticateJwt);


router.get("/", getVotaciones);



router.post("/",isCEE, createVotacion);
router.delete("/:id", isCEE, deleteVotacion);
router.put("/:id", isCEE, updateVotacion);


export default router;