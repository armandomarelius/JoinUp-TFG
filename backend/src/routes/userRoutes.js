import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../config/cloudinary.js";

const router = express.Router();

// Obtener perfil del usuario
router.get("/me", authMiddleware, getUserProfile);

// Actualizar perfil del usuario
router.put("/profile", authMiddleware, uploadAvatar.single("avatar"), updateUserProfile);

export default router;
