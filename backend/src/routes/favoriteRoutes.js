import express from "express";
import { 
  addToFavorites, 
  removeFromFavorites, 
  getUserFavorites, 
} from "../controllers/favoriteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// Agregar evento a favoritos
router.post("/", authMiddleware, addToFavorites);

// Quitar evento de favoritos
router.delete("/:eventId", authMiddleware, removeFromFavorites);

// Obtener todos los favoritos del usuario
router.get("/", authMiddleware, getUserFavorites);


export default router; 