"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js";
import eventoRoutes from "./evento.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/evento", eventoRoutes);

export default router;