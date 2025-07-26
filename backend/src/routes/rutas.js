import express from "express";
import {
  createGeneracion,
  updateGeneracion,
  deleteGeneracion,
} from "../controllers/generacion.controller.js";

const router = express.Router();

// Ruta para crear una nueva generación
router.post("/", createGeneracion);

// Ruta para actualizar una generación por ID
router.put("/:id", updateGeneracion);

// Ruta para eliminar una generación por ID
router.delete("/:id", deleteGeneracion);

export default router;