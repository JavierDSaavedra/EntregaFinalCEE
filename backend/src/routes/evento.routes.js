"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { getevento,createevento,geteventobyid,updateevento,deleteevento, } from "../controllers/evento.controller.js"; 

const router = Router();
router.use(authenticateJwt);

router.get("/",getevento);
router.get("/id",geteventobyid);
router.post("/", isAdmin, createevento)
router.put("/id",isAdmin,updateevento);
router.delete("/id", isAdmin,deleteevento); 
export default router;