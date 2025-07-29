"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { getevento,createevento,geteventobyid,updateevento,deleteevento, } from "../controllers/evento.controller.js"; 
import { isCEE } from "../middleware/cee.middleware.js";

const router = Router();
router.use(authenticateJwt);
router.use(isCEE);

router.get("/", getevento);
router.get("/:id", geteventobyid);
router.post("/", createevento)
router.put("/:id", updateevento);
router.delete("/:id", deleteevento); 

export default router;