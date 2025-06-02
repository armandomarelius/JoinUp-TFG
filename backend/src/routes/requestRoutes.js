import express from "express";
import { createRequest, getRequests, getRequestsByEvent, getRequestsReceived, updateRequestStatus, cancelRequest} from "../controllers/requestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

//todas estarán protegidas ya que el usuario debe estar
// autenticado para poder generar una solicitud

//crear solicitud
router.post("/", authMiddleware, createRequest); 
//obtener solicitudes por evento (para creador del evento)
router.get("/event/:eventId", authMiddleware, getRequestsByEvent);


//relativo a usuario 
// solicitudes mandadas por el usuario
router.get("/user", authMiddleware, getRequests);      
// solicitudes recibidas para el usuario
router.get("/received", authMiddleware, getRequestsReceived);


//actualizar estado de la solicitud (aceptar/rechazar) y añade participante si es aceptado
router.put("/:requestId/status", authMiddleware, updateRequestStatus);
//cancelar solicitud enviada por usuario
router.delete("/:requestId", authMiddleware, cancelRequest);





export default router;

