import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, no autenticado" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// verificar si usuario es admin 
export const adminMiddleware = async(req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Acceso denegado, no autorizado" });
    }
    next();

  } catch(error){
    return res.status(500).json({ message: "Error al verificar permisos de administrador" });
  }
}

export default authMiddleware;

