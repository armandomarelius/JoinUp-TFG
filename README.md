# JoinUp 🤝

**Red social para organizar y descubrir eventos** - Conecta con personas que comparten tus intereses.

![Estado del Proyecto](https://img.shields.io/badge/Estado-Completado-green)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-darkgreen)

## 📋 Descripción

JoinUp es una plataforma web que permite a los usuarios crear, descubrir y participar en eventos de todo tipo. Desde actividades deportivas hasta eventos culturales, JoinUp conecta a personas con intereses similares en su área local.

### ✨ Características Principales

- 🎯 **Crear y gestionar eventos** (participativos e informativos)
- 🗺️ **Visualización en mapa** con geolocalización
- 👥 **Sistema de participantes** y gestión de plazas
- ⭐ **Sistema de favoritos** para eventos
- 🔐 **Autenticación segura** con JWT
- 👨‍💼 **Panel de administración** completo
- 📱 **Diseño responsive** (Mobile First)
- 🔍 **Búsqueda y filtros** avanzados

## 🏗️ Arquitectura del Proyecto

```
JoinUp-TFG/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Estado global (Context API)
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── ...
│   ├── package.json
│   ├── Dockerfile
│   └── README.md           # 📖 Documentación del Frontend
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Lógica de controladores
│   │   ├── routes/          # Definición de rutas
│   │   ├── models/          # Modelos de MongoDB
│   │   ├── services/        # Lógica de negocio
│   │   ├── config/          # Configuraciones
│   │   └── ...
│   ├── package.json
│   ├── Dockerfile
│   └── README.md           # 📖 Documentación del Backend
├── docker-compose.yml       # Orquestación de servicios
└── README.md               # 📖 Este archivo
```

## 🚀 Inicio Rápido

### 📋 Prerequisitos

- **Node.js** 22+ y **npm**
- **Docker** y **Docker Compose** (recomendado)
- **Git**

### 🐳 Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/armandomarelius/JoinUp-TFG.git
cd JoinUp-TFG

# 2. Crear variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Configurar variables en los archivos .env

# 4. Iniciar todos los servicios
docker-compose up -d

# 5. Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# MongoDB Admin: http://localhost:8081
```

### 💻 Opción 2: Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/armandomarelius/JoinUp-TFG.git
cd JoinUp-TFG

# 2. Configurar Backend
cd backend
cp .env.example .env
# Editar .env con tus configuraciones
npm install
npm run dev

# 3. En otra terminal, configurar Frontend  
cd ../frontend
cp .env.example .env
# Editar .env con la URL del backend
npm install
npm run dev
```

## 🔧 Stack Tecnológico

### **Frontend**
- **React 19** - Biblioteca de interfaz
- **Vite 6** - Build tool y dev server
- **Tailwind CSS 4** - Estilos utility-first
- **React Router DOM 7** - Enrutamiento
- **Leaflet** - Mapas interactivos
- **React Context** - Gestión de estado

### **Backend**
- **Node.js 22** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB 8.0** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Cloudinary** - Gestión de imágenes

### **DevOps**
- **Docker** - Containerización
- **Docker Compose** - Orquestación local
- **Traefik** - Reverse proxy (en producción con Dokploy)

## 📚 Documentación

- 📖 **[Frontend README](./frontend/README.md)** - Documentación específica del frontend
- 📖 **[Backend README](./backend/README.md)** - Documentación específica del backend
- 🔧 **[Guía de instalación](#-inicio-rápido)** - Configuración paso a paso
- 🐳 **[Docker Guide](#-servicios-disponibles)** - Uso con Docker

## 🐳 Servicios Disponibles

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **Frontend** | `5173` | Aplicación React |
| **Backend** | `3000` | API Node.js |
| **MongoDB** | `27017` | Base de datos |
| **Mongo Express** | `8081` | Admin de MongoDB |

## 🌐 Variables de Entorno

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (`.env`)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://root:example@localhost:27017/joinup?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🗂️ Funcionalidades por Módulo

### 👤 **Autenticación**
- Registro e inicio de sesión
- JWT con cookies HTTP-only
- Roles de usuario (user/admin)
- Protección de rutas

### 🎯 **Eventos**
- Creación de eventos participativos e informativos
- Gestión de participantes y plazas
- Visualización en mapa con geolocalización
- Sistema de categorías
- Búsqueda y filtros

### ⭐ **Favoritos**
- Guardar eventos favoritos
- Lista personal de eventos guardados
- Notificaciones de eventos favoritos

### 👨‍💼 **Administración**
- Panel de control completo
- Gestión de usuarios y eventos
- Suspensión de usuarios

## 🚢 Despliegue

### 🔄 Con Dokploy (Recomendado)

1. **Configurar Dokploy** en tu servidor
2. **Crear aplicaciones** separadas para frontend y backend
3. **Conectar repositorios** Git
4. **Configurar variables** de entorno
5. **Deploy automático** con cada push

> **Nota**: No se necesita nginx con Dokploy ya que incluye Traefik como reverse proxy.

### 🐳 Con Docker Manual

```bash
# Build y deploy manual
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Backend tests (cuando estén implementados)
cd backend
npm test

# Frontend tests (cuando estén implementados)  
cd frontend
npm test
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Scripts Útiles

```bash
# Desarrollo completo con Docker
docker-compose up -d

# Solo backend
docker-compose up backend mongo

# Solo frontend  
docker-compose up frontend

# Ver logs
docker-compose logs -f [servicio]

# Limpiar volúmenes
docker-compose down -v
```



## 👨‍💻 Autor

**Armando Marelius** - [GitHub](https://github.com/armandomarelius) - [Email](mailto:armandomarelius777@gmail.com)

---

⭐ ¡Si te gusta el proyecto, dale una estrella en GitHub!

🤝 **JoinUp** - Conectando personas, creando experiencias. 