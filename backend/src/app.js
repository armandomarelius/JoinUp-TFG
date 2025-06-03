import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();

// Configuración de CORS para HTTPS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://localhost:5173',
  'https://localhost:3000',
  // Dominio con HTTPS
  `https://${process.env.MAIN_DOMAIN}`,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (apps móviles, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Verificar origins permitidos
      const isAllowed = allowedOrigins.includes(origin);
      
      // También verificar patrón traefik.me con HTTPS
      const isTraefikDomain = /^https:\/\/.*\.traefik\.me$/.test(origin);
      
      if (isAllowed || isTraefikDomain) {
        callback(null, true);
      } else {
        // Log solo para debug en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`CORS bloqueado para origen: ${origin}`);
        }
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 200
  })
);

app.use(express.json());
app.use(cookieParser());

// Conectar a MongoDB
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);

export default app;
