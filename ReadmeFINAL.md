# JoinUp 🤝
**Red Social para Organizar y Descubrir Eventos**

---

## 4.1. Introducción a la Aplicación (Getting Started)

### 🌟 Descripción del Proyecto

JoinUp es una plataforma web moderna que permite a los usuarios crear, descubrir y participar en eventos de todo tipo. Conecta personas con intereses similares en su área local, ofreciendo una experiencia completa de red social enfocada en eventos.

### ✨ Características Principales

- 🎯 **Gestión Completa de Eventos**: Creación de eventos participativos e informativos
- 🗺️ **Geolocalización**: Visualización de eventos en mapa interactivo
- 👥 **Sistema de Participación**: Gestión de solicitudes y participantes
- ⭐ **Sistema de Favoritos**: Guarda y organiza tus eventos favoritos
- 🔐 **Autenticación Segura**: Sistema JWT con cookies HTTP-only
- 👨‍💼 **Panel de Administración**: Control completo para administradores
- 📱 **Diseño Responsive**: Optimizado para dispositivos móviles
- 🔍 **Búsqueda Avanzada**: Filtros por ubicación, categoría y fecha

### 🏗️ Arquitectura del Proyecto

```
JoinUp-TFG/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Gestión de estado global
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # Servicios de API
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/     # Lógica de controladores
│   │   ├── routes/          # Definición de endpoints
│   │   ├── models/          # Modelos de MongoDB
│   │   ├── services/        # Lógica de negocio
│   │   ├── config/          # Configuraciones
│   │   └── middlewares/     # Middlewares personalizados
│   └── package.json
├── docker-compose.yml       # Configuración de contenedores
└── README.md
```

### 🔧 Stack Tecnológico

#### **Frontend**
- **React 19** con Vite 6
- **Tailwind CSS 4** para estilos
- **React Router DOM 7** para enrutamiento
- **Leaflet** para mapas interactivos
- **Context API** para gestión de estado

#### **Backend**
- **Node.js 22** con Express.js
- **MongoDB 8.0** con Mongoose ODM
- **JWT** para autenticación
- **Cloudinary** para gestión de imágenes
- **Multer** para subida de archivos

#### **DevOps**
- **Docker** y **Docker Compose**
- **Traefik** como reverse proxy (producción)

### 🌐 Aplicación en Producción

**Acceso directo para pruebas:**
- **URL**: [joinup.kristiansito.com](https://joinup.kristiansito.com)
- **Usuario Admin disponible**: 
  - Email: `adminPrueba@gmail.com`
  - User: `adminPrueba`
  - Password: `ñato'0'`

---

## 4.2. Manual de Instalación

### 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **Node.js 22+** y **npm** (para desarrollo local)
- **Git** para clonar el repositorio
- **Cuenta de Cloudinary** (para subida de imágenes)

### 🐳 Opción 1: Instalación con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/armandomarelius/JoinUp-TFG.git
cd JoinUp-TFG

# 2. Configurar variables de entorno (ver sección siguiente)
# Crear archivo .env en la carpeta backend con las credenciales

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Acceder a los servicios
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Mongo Express: http://localhost:8081
```

### 💻 Opción 2: Instalación para Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/armandomarelius/JoinUp-TFG.git
cd JoinUp-TFG

# 2. Configurar y ejecutar el backend
cd backend
npm install
npm run dev

# 3. En otra terminal, configurar y ejecutar el frontend
cd ../frontend
npm install
npm run dev

# 4. Configurar MongoDB (por separado)
# Necesitarás una instancia de MongoDB ejecutándose
```

### 🌐 Configuración de Variables de Entorno

#### Backend (.env) - ⚠️ REQUERIDO
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://root:example@localhost:27017/joinup?authSource=admin
JWT_SECRET=tu-clave-secreta-jwt-aqui

# 📸 CLOUDINARY (OBLIGATORIO para subida de imágenes)
CLOUDINARY_CLOUD_NAME=tu-nombre-de-cloud
CLOUDINARY_API_KEY=tu-api-key  
CLOUDINARY_API_SECRET=tu-api-secret
```

#### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 🔧 Configuración de Cloudinary

> **⚠️ IMPORTANTE**: Para que la aplicación funcione completamente en local, necesitas configurar una cuenta gratuita en [Cloudinary](https://cloudinary.com/) y obtener las credenciales API.

```bash
# 1. Ir a https://cloudinary.com/
# 2. Crear cuenta gratuita
# 3. Ir al Dashboard
# 4. Copiar las credenciales a tu archivo .env:
#    - Cloud Name
#    - API Key  
#    - API Secret
```

### 👨‍💼 Configuración de Usuario Administrador (Solo Local)

```bash
# Después de levantar Docker Compose:

# 1. Registrar un usuario normal en http://localhost:5173
# 2. Ir a Mongo Express: http://localhost:8081
#    Usuario: user
#    Password: example

# 3. Navegar a: joinup > users
# 4. Encontrar tu usuario creado
# 5. Editar el documento y cambiar:
#    "isAdmin": false  →  "isAdmin": true

# 6. Guardar cambios
# 7. Refrescar la aplicación - ya tendrás acceso admin
```

### 🐳 Servicios Disponibles

| Servicio | Puerto | Descripción | Credenciales |
|----------|--------|-------------|--------------|
| **Frontend** | `5173` | Aplicación React | - |
| **Backend** | `3000` | API Node.js | - |
| **MongoDB** | `27017` | Base de datos | root:example |
| **Mongo Express** | `8081` | Admin MongoDB | user:example |

---

## 4.3. Manual de Usuario

### 🚀 Primeros Pasos

1. **Acceder a la aplicación**: Ir a la URL de la aplicación
2. **Registro**: Crear una cuenta nueva con email y contraseña
3. **Inicio de sesión**: Acceder con tus credenciales
4. **Completar perfil**: Subir avatar y completar información personal

### 👤 Gestión de Perfil

#### Actualizar Perfil
- Cambiar información personal (nombre, email, descripción)
- Subir o cambiar avatar personal

### 🎯 Gestión de Eventos

#### Crear Eventos
- **Crear nuevos eventos** con imagen, ubicación y detalles completos
- **Seleccionar tipo de evento**:
  - **Participativos**: Con límite de participantes y sistema de solicitudes
  - **Informativos**: Solo para difundir información sin participación
- **Configurar detalles**: Fecha, hora, ubicación, descripción, categoría
- **Subir imagen representativa** del evento

#### Visualizar Eventos
- **Ver todos los eventos públicos** disponibles
- **Consultar mis eventos creados** con estado y participantes
- **Ver eventos donde participo** como invitado
- **Explorar eventos próximos** por fecha
- **Buscar eventos cercanos** por ubicación
- **Filtrar eventos** por categoría, fecha o ubicación

#### Gestionar Mis Eventos
- **Editar información** de eventos propios
- **Cambiar estado** de eventos (abierto/cerrado para nuevas solicitudes)
- **Eliminar eventos** creados por mí
- **Gestionar participantes**: Ver lista de participantes actuales
- **Revisar solicitudes**: Aceptar o rechazar solicitudes de participación

### 👥 Sistema de Participación

#### Solicitar Participación
- **Enviar solicitudes** para participar en eventos de otros usuarios
- **Incluir mensaje personalizado** en la solicitud
- **Ver estado** de mis solicitudes enviadas

#### Gestionar Solicitudes
- **Ver solicitudes enviadas** con su estado actual
- **Ver solicitudes recibidas** para mis eventos
- **Responder a solicitudes**: Aceptar o rechazar con mensaje opcional

#### Participación en Eventos
- **Abandonar eventos** en los que ya participo
- **Ver historial** de eventos donde he participado
- **Recibir notificaciones** sobre cambios en eventos donde participo

### ⭐ Sistema de Favoritos

#### Gestionar Favoritos
- **Marcar eventos como favoritos** para seguimiento
- **Ver lista personal** de eventos favoritos
- **Quitar eventos** de la lista de favoritos
- **Recibir notificaciones** de cambios en eventos favoritos

### 🗺️ Funcionalidades del Mapa

- **Visualización geográfica**: Ver todos los eventos en mapa interactivo
- **Navegación por ubicación**: Explorar eventos por área geográfica
- **Filtros de proximidad**: Buscar eventos cerca de ubicación específica
- **Detalles rápidos**: Ver información básica al hacer click en marcadores

### 🔍 Búsqueda y Filtros

- **Búsqueda por texto**: Encontrar eventos por nombre o descripción
- **Filtros avanzados**:
  - Por categoría de evento
  - Por rango de fechas
  - Por ubicación o distancia
  - Por tipo (participativo/informativo)
  - Por disponibilidad de plazas

---

## 4.4. Manual de Administración

### 🔐 Acceso de Administrador

#### Identificación y Acceso
- Los usuarios administradores tienen permisos especiales en el sistema
- Acceso al **Panel de Administración** desde el menú principal
- Funcionalidades exclusivas no disponibles para usuarios regulares

#### Credenciales de Prueba (Producción)
```bash
# Usuario Administrador
Email: adminPrueba@gmail.com
User: adminPrueba
Password: ñato'0'
```

### 👥 Gestión de Usuarios

#### Supervisión de Usuarios
- **Ver lista completa** de todos los usuarios registrados

#### Moderación de Usuarios
- **Suspender cuentas** de usuarios que violen las normas
- **Reactivar cuentas** previamente suspendidas
- **Gestionar reportes** enviados por otros usuarios
- **Monitorear actividad sospechosa** o comportamientos inadecuados

#### Efectos de la Suspensión
- Usuario no puede iniciar sesión en la plataforma
- Sus eventos existentes se mantienen visibles
- No puede crear nuevos eventos
- No puede participar en eventos de otros usuarios
- No puede enviar solicitudes de participación

### 🎯 Gestión de Eventos

#### Supervisión de Eventos
- **Ver todos los eventos** creados en la plataforma
- **Consultar detalles completos** de cualquier evento:
  - Información del creador
  - Detalles del evento (fecha, ubicación, descripción)
  - Lista de participantes
  - Estado actual del evento
  - Actividad relacionada

#### Moderación de Eventos
- **Eliminar eventos** que violen las normas de la comunidad
- **Gestionar eventos problemáticos** o inapropiados
- 
---

## 📡 Endpoints Importantes de la API

### **Autenticación** `/api/auth`
- `POST /login` - Iniciar sesión
- `POST /register` - Registrar usuario
- `POST /logout` - Cerrar sesión
- `GET /check-auth` - Verificar autenticación

### **Eventos** `/api/events`
- `GET /` - Obtener todos los eventos
- `GET /upcoming` - Eventos próximos
- `GET /nearby` - Eventos por ubicación
- `POST /` - Crear evento (requiere autenticación + imagen)
- `GET /user` - Eventos del usuario
- `GET /participating` - Eventos en los que participa
- `GET /:id` - Obtener evento por ID
- `PUT /:id` - Actualizar evento (con imagen opcional)
- `PUT /:id/status` - Cambiar estado del evento
- `DELETE /:id` - Eliminar evento
- `DELETE /:eventId/leave` - Abandonar evento
- `DELETE /:eventId/remove/:participantId` - Eliminar participante

### **Usuarios** `/api/users`
- `GET /me` - Obtener perfil del usuario
- `PUT /profile` - Actualizar perfil (con avatar opcional)

### **Favoritos** `/api/favorites`
- `POST /` - Agregar a favoritos
- `DELETE /:eventId` - Quitar de favoritos
- `GET /` - Obtener favoritos del usuario

### **Solicitudes** `/api/requests`
- `POST /` - Crear solicitud de participación
- `GET /event/:eventId` - Solicitudes por evento
- `GET /user` - Solicitudes enviadas por usuario
- `GET /received` - Solicitudes recibidas
- `PUT /:requestId/status` - Actualizar estado de solicitud
- `DELETE /:requestId` - Cancelar solicitud

### **Administración** `/api/admin` *(Solo Admin)*
- `GET /users` - Obtener todos los usuarios
- `GET /events` - Obtener todos los eventos
- `DELETE /events/:id` - Eliminar evento
- `PUT /users/:id/toggle` - Suspender/reactivar usuario

---

## 📄 Información Adicional

### 📝 Licencia
Este proyecto está bajo la Licencia MIT.

### 👨‍💻 Autor
**Armando Marelius**
- GitHub: [@armandomarelius](https://github.com/armandomarelius)
- Email: armandomarelius777@gmail.com

---

### 🚀 ¡Comienza a conectar con tu comunidad local a través de eventos!






