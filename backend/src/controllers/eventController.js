import Event from "../models/Event.js";
import { cloudinary } from '../config/cloudinary.js';
import { geocodeAddress } from '../services/geocodingService.js';
import EventRequest from "../models/EventRequest.js";
import { updateExpiredEvents } from '../services/eventService.js';

export const getAllEvents = async (req, res) => {
    try {
        await updateExpiredEvents();
        
        const events = await Event.find({ status: "open" })
            .populate("created_by", "username avatar")
            .populate("participants", "username avatar");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los eventos" });
    }
}

export const publishEvent = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            location, 
            coordinates,
            date, 
            category, 
            participation_type,
            max_participants 
        } = req.body;

        // Validación básica de campos requeridos
        if (!title || !description || !location || !date || !category) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos",
            });
        }

        // Validar que max_participants esté presente para eventos participativos
        if (participation_type === "participative" && !max_participants) {
            return res.status(400).json({
                message: "El número máximo de participantes es obligatorio para eventos participativos",
            });
        }

        // Si se proporciona location pero no coordinates, intentamos geocodificar
        let eventCoordinates = coordinates;
        if (!eventCoordinates && location) {
            try {
                const geocoded = await geocodeAddress(location);
                if (geocoded) {
                    eventCoordinates = {
                        lat: geocoded.lat,
                        lng: geocoded.lng
                    };
                }
            } catch (geocodeError) {
                console.error("Error al geocodificar:", geocodeError);
                // Continuamos sin coordenadas si falla
            }
        }

        let image = {};
        if (req.file) { 
            image = {
                public_id: req.file.filename,
                url: req.file.path
            };
        }

        // Crear el evento con el tipo especificado
        const event = new Event({
            title,
            description,
            location,
            coordinates: eventCoordinates,
            date,
            category,
            participation_type: participation_type || "participative",
            max_participants,
            created_by: req.userId,
            image,
            participants: [req.userId] // el creador es automáticamente el primer participante
        });

        await event.save();
        res.status(201).json({message: "Evento creado exitosamente", event});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el evento" });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, coordinates, date, category, max_participants } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        if (event.created_by.toString() !== req.userId) {
            return res.status(403).json({ message: "No tienes permisos para actualizar este evento" });
        }

        if (date) {
            const eventDate = new Date(date);
            const now = new Date();
            
            if (eventDate <= now) {
                return res.status(400).json({ 
                    message: "La fecha del evento debe ser en el futuro" 
                });
            }
        }

        let image = event.image;
        if (req.file) {
            // Si hay una imagen anterior, la eliminamos de Cloudinary
            if (event.image && event.image.public_id) {
                await cloudinary.uploader.destroy(event.image.public_id);
            }
            image = {
                public_id: req.file.filename,
                url: req.file.path
            };
        }

        // Preparar los datos de actualización
        const updateData = {
            title,
            description,
            location,
            coordinates,
            date,
            category,
            image
        };

        // Solo incluir max_participants si el evento es participativo
        if (event.participation_type === "participative") {
            updateData.max_participants = max_participants;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }   

        res.json({ message: "Evento actualizado exitosamente", event: updatedEvent });

    } catch(error) {
        res.status(500).json({ message: "Error al actualizar el evento" });
    }
}

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate("created_by", "username avatar")
            .populate("participants", "username avatar");
        
        // Validar si el evento existe
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        res.json(event);
    } catch (error) {
        console.error('Error en getEventById:', error);  
        res.status(500).json({ message: "Error al obtener el evento" });
    }
}

export const deleteEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }   

        if (event.created_by.toString() !== req.userId) {
            return res.status(403).json({ message: "No tienes permisos para eliminar este evento" });
        }

        // Eliminar la imagen de Cloudinary si existe
        if (event.image && event.image.public_id) {
            await cloudinary.uploader.destroy(event.image.public_id);
        }

        await Event.findByIdAndDelete(id);

        res.json({ message: "Evento eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el evento" });
    }
}

export const getEventsByUser = async (req, res) => {
    try {
        const events = await Event.find({ created_by: req.userId })
            .populate("created_by", "username avatar")
            .populate("participants", "username avatar");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los eventos" });
    }       
}

export const leaveEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        //verificar si el usuario es participante del evento
        if (!event.participants.includes(req.userId)) { 
            return res.status(400).json({ message: "No eres participante de este evento" });
        }

        //eliminar el usuario de la lista de participantes
        event.participants = event.participants.filter(participant => participant.toString() !== req.userId);
        await event.save();

        // ATENTO: Eliminar la solicitud aceptada del usuario para este evento
        await EventRequest.findOneAndDelete({
            event: eventId,
            user: req.userId,
            status: "accepted"
        });

        res.json({ message: "Has abandonado el evento exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al abandonar el evento" });
    }       
}

export const removeParticipant = async (req, res) => {
    try {
        const { eventId, participantId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        // Verificar si el usuario es el creador del evento  
        if (event.created_by.toString() !== req.userId) {   
            return res.status(403).json({ message: "No tienes permisos para eliminar participantes de este evento" });
        }

        // Verificar que el participante realmente esté en el evento
        if (!event.participants.includes(participantId)) {
            return res.status(400).json({ message: "El usuario no es participante de este evento" });
        }

        // Eliminar el participante del evento
        event.participants = event.participants.filter(participant => participant.toString() !== participantId);
        await event.save();

        // 🆕 NUEVO: Eliminar TODAS las solicitudes del usuario para este evento
        // Esto incluye solicitudes pendientes, aceptadas o rechazadas
        const deletedRequests = await EventRequest.deleteMany({
            event: eventId,
            user: participantId
        });

        console.log(`Participante eliminado. Solicitudes eliminadas: ${deletedRequests.deletedCount}`);

        res.json({ 
            message: "Participante eliminado exitosamente",
            requestsDeleted: deletedRequests.deletedCount 
        });
    } catch (error) {
        console.error('Error al eliminar el participante:', error);
        res.status(500).json({ message: "Error al eliminar el participante" });
    }   
};

export const getEventsByLocation = async (req, res) => {
    try {
        await updateExpiredEvents();
        
        const { lat, lng, distance = 25, limit } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: "Latitud y longitud son requeridas" });
        }

        // Construir la query
        let query = Event.find({ 
            status: "open",
            $and: [
                {
                    "coordinates.lat": { 
                        $gte: parseFloat(lat) - (distance / 111), 
                        $lte: parseFloat(lat) + (distance / 111) 
                    }
                },
                {
                    "coordinates.lng": { 
                        $gte: parseFloat(lng) - (distance / (111 * Math.cos(parseFloat(lat) * Math.PI / 180))), 
                        $lte: parseFloat(lng) + (distance / (111 * Math.cos(parseFloat(lat) * Math.PI / 180))) 
                    }
                }
            ]
        }).populate("created_by", "username avatar")
          .populate("participants", "username avatar")
          .sort({ date: 1 }); // Ordenar por fecha

        // Aplicar límite si se proporciona
        if (limit) {
            const parsedLimit = parseInt(limit);
            if (parsedLimit > 0) {
                query = query.limit(parsedLimit);
            }
        }

        const events = await query;
        
        res.json(events);
    } catch (error) {
        console.error('Error en getEventsByLocation:', error);
        res.status(500).json({ message: "Error al obtener eventos por ubicación" });
    }
};

export const getUpcomingEvents = async (req, res) => {
    try {
        await updateExpiredEvents();
        
        const limit = parseInt(req.query.limit) || 2;
        const now = new Date();
        
        const events = await Event.find({ 
            status: "open",          
            date: { $gte: now }
        })
        .populate("created_by", "username avatar")
        .populate("participants", "username avatar")
        .sort({ date: 1 })        
        .limit(limit);
        
        res.json(events);
    } catch (error) {
        console.error('Error en getUpcomingEvents:', error);
        res.status(500).json({ message: "Error al obtener los eventos próximos" });
    }
};

export const getParticipatingEvents = async (req, res) => {
    try {
        await updateExpiredEvents();
        
        const events = await Event.find({ 
            participants: req.userId,
            created_by: { $ne: req.userId }
        })
        .populate("created_by", "username avatar")
        .populate("participants", "username avatar");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener eventos de participación" });
    }
};

export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validar que el status sea válido
        if (!["open", "close"].includes(status)) {
            return res.status(400).json({ 
                message: "Estado inválido. Solo se puede cambiar entre 'open' y 'close'" 
            });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        // Verificar que el usuario sea el creador del evento
        if (event.created_by.toString() !== req.userId) {
            return res.status(403).json({ 
                message: "No tienes permisos para cambiar el estado de este evento" 
            });
        }

        // Verificar que el evento no esté finished
        if (event.status === "finished") {
            return res.status(400).json({ 
                message: "No se puede cambiar el estado de un evento finalizado" 
            });
        }

        // Verificar que el evento no haya pasado de fecha
        const now = new Date();
        if (event.date < now) {
            return res.status(400).json({ 
                message: "No se puede cambiar el estado de un evento que ya ocurrió" 
            });
        }

        event.status = status;
        await event.save();

        res.json({ 
            message: "Estado del evento actualizado exitosamente", 
            event 
        });
    } catch (error) {
        console.error('Error al actualizar estado del evento:', error);
        res.status(500).json({ message: "Error al actualizar el estado del evento" });
    }
};


