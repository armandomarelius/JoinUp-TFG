import User from "../models/User.js";
import { cloudinary } from '../config/cloudinary.js';

// obtener el perfil del usuario autenticado
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};


// actualizar el perfil del usuario autenticado
export const updateUserProfile = async (req, res) => {
  try {
    const { about_me } = req.body;
    
    let updateData = { about_me };
    
    // Si hay una nueva imagen de avatar
    if (req.file) {
      // Si el usuario ya tiene un avatar en Cloudinary, lo eliminamos
      const user = await User.findById(req.userId);
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      
      // Añadimos el nuevo avatar
      updateData.avatar = {
        public_id: req.file.filename,
        url: req.file.path
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};
