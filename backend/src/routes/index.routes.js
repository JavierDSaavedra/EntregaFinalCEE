"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import votacionesRoutes from "./votacion.routes.js";
import preguntaroutes from "./pregunta.routes.js";
import respuestaRoutes from "./respuesta.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/votacion", votacionesRoutes);
router.use("/pregunta", preguntaroutes);
router.use("/respuesta", respuestaRoutes);

export default router;