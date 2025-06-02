import express from "express";
import {
  getAllEvents,
  publishEvent,
  updateEvent,
  getEventById,
  deleteEventById,
  getEventsByUser,
  getParticipatingEvents,
  leaveEvent,
  removeParticipant,
  getEventsByLocation,
  getUpcomingEvents,
  updateEventStatus,
} from "../controllers/eventController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { uploadEvent } from "../config/cloudinary.js";

const router = express.Router();

//obtiene todos los eventos abiertos
router.get("/", getAllEvents);
// obtener eventos próximos
router.get("/upcoming", getUpcomingEvents);
// obtener eventos por ubicación
router.get("/nearby", getEventsByLocation);
// publicar un evento (ruta protegida)
router.post("/", authMiddleware, uploadEvent.single("image"), publishEvent);
// obtener eventos creados por el usuario 
router.get("/user", authMiddleware, getEventsByUser);
// obtener eventos en los que participa el usuario
router.get("/participating", authMiddleware, getParticipatingEvents);
// obtener un evento por id
router.get("/:id", getEventById);
// actualizar un evento por id (ruta protegida)
router.put("/:id", authMiddleware, uploadEvent.single("image"), updateEvent);
// cambiar estado del evento (open/close)
router.put("/:id/status", authMiddleware, updateEventStatus);
// eliminar un evento por id (ruta protegida)
router.delete("/:id", authMiddleware, deleteEventById);

//de acuerdo al usuario
//abandonar un evento en el que el usuario participa
router.delete("/:eventId/leave", authMiddleware, leaveEvent);
//eliminar participante de un evento (por el creador del evento)
router.delete("/:eventId/remove/:participantId",authMiddleware, removeParticipant);


export default router;
