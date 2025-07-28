import express from "express";
import { cambiarRolUsuario } from "../controllers/modificaruser.controller.js"; // Asegúrate de usar el controlador correcto
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = express.Router();

// Ruta protegida: Solo superadministrador puede cambiar el rol de un usuario
router.patch("/usuarios/:id/rol", authenticateJwt, isAdmin, cambiarRolUsuario);

export default router;