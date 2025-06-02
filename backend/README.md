# JoinUp Backend 🚀

Backend API para la aplicación JoinUp - Red social para eventos.

## 📁 Estructura del Proyecto

```
backend/
├── src/                     # Código fuente
│   ├── app.js              # Configuración principal de Express
│   ├── server.js           # Punto de entrada del servidor
│   ├── controllers/        # Lógica de controladores
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── eventController.js
│   │   ├── requestController.js
│   │   ├── favoriteController.js
│   │   └── adminController.js
│   ├── routes/             # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── adminRoutes.js
│   ├── models/             # Modelos de Mongoose
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── EventRequest.js
│   │   └── Favorite.js
│   ├── services/           # Servicios y lógica de negocio
│   │   ├── eventService.js
│   │   └── geocodingService.js
│   ├── middlewares/        # Middlewares personalizados
│   │   └── authMiddleware.js
│   ├── config/             # Configuraciones
│   │   ├── db.js
│   │   └── cloudinary.js
│   └── utils/              # Utilidades (futuro)
├── package.json            # Dependencias y scripts
├── Dockerfile              # Imagen Docker
├── .gitignore
├── .env.example           # Variables de entorno ejemplo
└── README.md              # Documentación
```

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de producción
npm start

# Iniciar servidor de desarrollo con hot-reload
npm run dev

# Ejecutar tests (no implementado aún)
npm test
```

## ⚙️ Configuración

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configura las variables de entorno en `.env`

3. Instala dependencias:
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## 🐳 Docker

Para ejecutar con Docker:

```bash
# Desde la raíz del proyecto
docker-compose up backend
```

## 📚 API Endpoints

- **Auth**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Events**: `/api/events/*`
- **Requests**: `/api/requests/*`
- **Admin**: `/api/admin/*`
- **Favorites**: `/api/favorites/*`

## 🔧 Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **Cloudinary** para imágenes
- **Docker** para contenedores 