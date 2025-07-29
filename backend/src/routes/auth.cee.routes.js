import express from "express";
import { cambiarRolUsuario } from "../controllers/modificaruser.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = express.Router();
router.use(authenticateJwt);
router.use(isAdmin);               


router.patch("/usuarios/:id/role", isAdmin, cambiarRolUsuario);


export default router;