import User from "../models/User.js";
import Event from "../models/Event.js";

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
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Evento eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar evento" });
  }
};

// Suspender/reactivar usuario (opcional, si tienes campo isActive)
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
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: "Estado de usuario actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};
