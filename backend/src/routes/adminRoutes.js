import express from "express";
import authMiddleware, { adminMiddleware } from "../middlewares/authMiddleware.js";
import { getAllUsers, getAllEvents, deleteEvent, toggleUserStatus } from "../controllers/adminController.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Obtener todos los eventos
router.get("/events", authMiddleware, adminMiddleware, getAllEvents);

// Eliminar un evento
router.delete("/events/:id", authMiddleware, adminMiddleware, deleteEvent);

// Suspender/reactivar usuario 
router.put("/users/:id/toggle", authMiddleware, adminMiddleware, toggleUserStatus);

export default router;
