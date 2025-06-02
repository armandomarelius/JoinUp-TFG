import EventRequest from "../models/EventRequest.js";
import Event from "../models/Event.js";

export const createRequest = async (req, res) => {
    try {
        const { eventId } = req.body;
        
        // Verificar si el evento existe
        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
            return res.status(404).json({ message: "El evento no existe" });
        }

        // Verificar si el evento es informativo
        if (eventExists.participation_type === "informative") {
            return res.status(403).json({ 
                message: "No se pueden enviar solicitudes a eventos informativos" 
            });
        }

        // Verificar si el status del evento es open
        if (eventExists.status !== "open") {
            return res.status(400).json({ message: "El evento no está abierto para solicitudes" });
        }
        
        //  Comprobar si el usuario ya es participante
        if (eventExists.participants.includes(req.userId)) {
            return res.status(400).json({ message: "Ya eres participante de este evento" });
        }
        
        // Verificar si ya existe una solicitud pendiente
        const existingRequest = await EventRequest.findOne({
            event: eventId,
            user: req.userId,
            status: "pending" 
        });
        
        if (existingRequest) {
            return res.status(400).json({ message: "Ya has enviado una solicitud para este evento" });
        }

        // Verificar si el evento tiene un límite de participantes
        if (eventExists.max_participants && eventExists.participants.length >= eventExists.max_participants) {
            return res.status(400).json({ message: "El evento está lleno, no se pueden enviar más solicitudes" });
        }

        // verifiar el nº de solicitudes pendientes del usuario (limitar a 10)
        const pendingRequestsCount = await EventRequest.countDocuments({
            status: "pending",
            user: req.userId
        });

        if (pendingRequestsCount >= 10) {
            return res.status(400).json({ message: "Has alcanzado el límite de solicitudes pendientes, espera a que sean procesadas algunas" });
        }
        
        // Crear la solicitud
        const request = new EventRequest({ 
            event: eventId, 
            user: req.userId 
        });
        
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la solicitud, revisa datos" });
    }
}

export const getRequests = async (req, res) => {
    try {
        const requests = await EventRequest.find({ user: req.userId }).populate("event");
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error en getRequests:', error);
        res.status(500).json({ message: "Error al obtener las solicitudes" });
    }
}

export const getRequestsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const requests = await EventRequest.find({ event: eventId }).populate("user", "username");
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error en getRequestsByEvent:', error);
        res.status(500).json({ message: "Error al obtener las solicitudes" });
    }
}

export const getRequestsReceived = async (req, res) => {
    try {
        // 1. Obtener todos los eventos creados por el usuario
        const userEvents = await Event.find({ created_by: req.userId });
        
        // Si no hay eventos, array vacío
        if (userEvents.length === 0) {
            return res.status(200).json([]);
        }
        
        // 2. Obtenemos los IDs de los eventos
        const eventIds = userEvents.map(event => event._id);
        
        // 3. Buscar todas las solicitudes para los eventos del usuario
        const requests = await EventRequest.find({ 
            event: { $in: eventIds } 
        })
        .populate("user", "username avatar") // Información del solicitante
        .populate("event", "title date location") // Información básica del evento
        .sort({ request_date: -1 }); // Ordenar por más recientes primero
        
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las solicitudes recibidas" });
    }
};


export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params; 
        const { status } = req.body; 

        //verificar si la solicitud existe
        const request = await EventRequest.findById(requestId).populate('event', "created_by participants");
        if (!request) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        //verificar si el creador del evento es el usuario autenticado
        if (request.event.created_by.toString() !== req.userId) {
            return res.status(403).json({ message: "No tienes permisos para actualizar esta solicitud" });
        }

        //actualizar el estado de la solicitud
        request.status = status;
        await request.save();

        //si la solicitud es aceptada, añadir participante al evento
        if (status === "accepted") {
            // Verificar que el usuario no esté ya en la lista de participantes
            if (!request.event.participants.includes(request.user)) {
                request.event.participants.push(request.user);
                await request.event.save();
            }
        }

        res.status(200).json({ message: "Solicitud actualizada exitosamente" });  
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la solicitud" });
    }
}


export const cancelRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await EventRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        //verficar si usuario es el creador de la solicitud
        if (request.user.toString() !== req.userId) {
            return res.status(403).json({ message: "No tienes permisos para cancelar esta solicitud" });
        }

        //verificar si la solicitud está pendiente
        if (request.status !== "pending") {
            return res.status(400).json({ message: "La solicitud debe estar pendiente para ser cancelada" });
        }   

        await EventRequest.findByIdAndDelete(requestId);
        res.status(200).json({ message: "Solicitud cancelada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar la solicitud" });
    }
}

