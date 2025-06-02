import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] // Permite login con email o username
    });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Usuario suspendido. Contacta con soporte o espera a que sea reactivado." });
    }

    //Se genera token JWT que contiene el ID del usuario (userId) y expira en 1 hora.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3600000, // 1 hora 
      sameSite: "strict", 
    });

    res.json({ 
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


const register = async (req, res) => {
  try {
    const { username, email, password, isAdmin, about_me, avatar } = req.body;

    // Verificar si el usuario ya existe (por username o email)
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
    }
    const user = new User({ username, email, password, isAdmin, about_me, avatar });
    await user.save();

    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};



const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // La cookie expira inmediatamente
    });
    res.json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export { login, logout, register };
