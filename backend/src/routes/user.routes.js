import { Router } from "express";
import { getUsers, getUserById, getProfile, updateUserById, deleteUserById, getUsersByGeneracion } from "../controllers/user.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin, isCEE } from "../middleware/authorization.middleware.js";

const router = Router();


router.use(authenticateJwt);

router.get("/profile", getProfile);


router.get("/generacion/:generacion", isCEE, getUsersByGeneracion);

router.use(isAdmin);


router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;