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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'JoinUp Backend',
    env: process.env.NODE_ENV,
    database: process.env.MONGODB_URI?.split('/').pop()?.split('?')[0] || 'unknown'
  });
});

// Configuración de CORS usando tus variables
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://192.168.1.155:5173',
  'http://192.168.1.155:3000',
  // Tu dominio específico
  `http://${process.env.MAIN_DOMAIN || 'joinup-project-joinupcompose-ncv5ku-dacd89-192-168-1-155.traefik.me'}`,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('🌐 CORS Origin recibido:', origin);
      console.log('🔧 Frontend URL configurada:', process.env.FRONTEND_URL);
      console.log('🔧 Main Domain:', process.env.MAIN_DOMAIN);
      
      // Permitir requests sin origin
      if (!origin) {
        console.log('✅ CORS: Permitiendo request sin origin');
        return callback(null, true);
      }
      
      // Verificar origins permitidos
      const isAllowed = allowedOrigins.includes(origin);
      
      // También verificar patrón traefik.me
      const isTraefikDomain = /^http:\/\/.*\.traefik\.me$/.test(origin);
      
      if (isAllowed || isTraefikDomain) {
        console.log(`✅ CORS: Permitiendo origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ CORS: Bloqueando origin: ${origin}`);
        console.log('📋 Origins permitidos:', allowedOrigins);
        
        // Permitir todo en desarrollo para debug
        console.log('🔧 Permitiendo de todas formas para debug');
        callback(null, true);
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

// Middleware para logging detallado
app.use((req, res, next) => {
  console.log(`🔄 ${req.method} ${req.path}`);
  console.log(`📍 Origin: ${req.headers.origin || 'none'}`);
  console.log(`🔗 Referer: ${req.headers.referer || 'none'}`);
  next();
});

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
