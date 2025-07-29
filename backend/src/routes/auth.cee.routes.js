import express from "express";
import { cambiarRolUsuario } from "../controllers/modificaruser.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import  authController from "../controllers/auth.controller.js"; 

const router = express.Router();
router.use(isCEE);


router.patch("/usuarios/:id/rol", authenticateJwt, isAdmin, cambiarRolUsuario);

router.post('/registro', authController.register);

export default router;