"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import Registros_FinanzasRoutes from "./Registros_Finanzas.routes.js";
import votacionesRoutes from "./votacion.routes.js";
import preguntaroutes from "./pregunta.routes.js";
import respuestaRoutes from "./respuesta.routes.js";
import alumnosRoutes from "./alumnos.routes.js";
import authceeRoutes from "./auth.cee.routes.js";
import eventoRoutes from "./evento.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/eventos", eventoRoutes);
router.use("/finanzas", Registros_FinanzasRoutes);
router.use("/votacion", votacionesRoutes);
router.use("/pregunta", preguntaroutes);
router.use("/respuesta", respuestaRoutes);
router.use("/alumnos", alumnosRoutes);
router.use("/cee", authceeRoutes);

export default router; 