import User from "../models/User.js";
import Event from "../models/Event.js";
import Favorite from "../models/Favorite.js";
import EventRequest from "../models/EventRequest.js";
import { cloudinary } from "../config/cloudinary.js";

// Obtener todos los usuarios (sin contraseñas)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener todos los eventos
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate("created_by", "username");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener eventos" });
  }
};

// Eliminar un evento
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el evento existe
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Eliminar la imagen de Cloudinary si existe
    if (event.image && event.image.public_id) {
      await cloudinary.uploader.destroy(event.image.public_id);
    }

    //  ELIMINACIÓN EN CASCADA
    // 1. Eliminar todos los favoritos que referencian este evento
    await Favorite.deleteMany({ event: id });
    
    // 2. Eliminar todas las solicitudes para este evento
    await EventRequest.deleteMany({ event: id });
    
    // 3. Finalmente eliminar el evento
    await Event.findByIdAndDelete(id);
    
    res.json({ message: "Evento eliminado exitosamente" });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ message: "Error al eliminar evento" });
  }
};

// Suspender/reactivar usuario
export const toggleUserStatus = async (req, res) => {
  try {
    if (req.userId === req.params.id) {
      return res.status(400).json({ message: "No puedes suspender tu propia cuenta." });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    
    if (user.isAdmin) {
      return res.status(403).json({ message: "No puedes suspender a otro administrador." });
    }
    
    const previousStatus = user.isActive;
    user.isActive = !user.isActive;
    await user.save();

    // SI SE SUSPENDE EL USUARIO, LIMPIAR SUS PARTICIPACIONES EN EVENTOS FUTUROS
    if (!user.isActive && previousStatus) {
      const now = new Date();
      
      // Quitar al usuario de todos los eventos futuros donde participa
      const updateResult = await Event.updateMany(
        {
          participants: req.params.id,
          date: { $gt: now }
        },
        {
          $pull: { participants: req.params.id }
        }
      );

      // CANCELAR TODAS SUS SOLICITUDES PENDIENTES
      const deletedRequests = await EventRequest.deleteMany({
        user: req.params.id,
        status: "pending"
      });

      console.log(`Usuario suspendido: limpiadas ${updateResult.modifiedCount} participaciones y ${deletedRequests.deletedCount} solicitudes`);
    }
    
    res.json({ 
      message: "Estado de usuario actualizado"
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};
