import Favorite from "../models/Favorite.js";
import Event from "../models/Event.js";

// Agregar evento a favoritos
export const addToFavorites = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.userId;

    // Verificar que el evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await Favorite.findOne({ 
      user: userId, 
      event: eventId 
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "El evento ya está en favoritos" });
    }

    // Crear nuevo favorito
    const favorite = new Favorite({
      user: userId,
      event: eventId
    });

    await favorite.save();

    res.status(201).json({ 
      message: "Evento agregado a favoritos",
      favorite 
    });

  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Quitar evento de favoritos
export const removeFromFavorites = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId;

    const favorite = await Favorite.findOneAndDelete({ 
      user: userId, 
      event: eventId 
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    res.status(200).json({ message: "Evento eliminado de favoritos" });

  } catch (error) {
    console.error("Error al eliminar de favoritos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todos los favoritos del usuario
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId;

    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: 'event',
        populate: {
          path: 'created_by',
          select: 'username avatar'
        }
      })
      .sort({ created_at: -1 });  

    res.status(200).json(favorites);

  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


