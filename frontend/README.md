# JoinUp Frontend 🎨

Frontend React para JoinUp - Red social para organizar y descubrir eventos.

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos públicos estáticos
├── src/                    # Código fuente
│   ├── components/         # Componentes reutilizables
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── ui/            # Componentes de interfaz básicos
│   │   ├── profile/       # Componentes de perfil
│   │   └── events/        # Componentes relacionados con eventos
│   ├── pages/             # Páginas principales
│   │   ├── Home.jsx       # Página principal
│   │   ├── Login.jsx      # Inicio de sesión
│   │   ├── Register.jsx   # Registro de usuarios
│   │   ├── Events.jsx     # Lista de eventos
│   │   ├── EventDetails.jsx # Detalles del evento
│   │   ├── CreatePlan.jsx # Crear nuevo evento
│   │   ├── Profile.jsx    # Perfil de usuario
│   │   ├── AdminDashboard.jsx # Panel de administración
│   │   ├── About.jsx      # Acerca de
│   │   └── ErrorPage.jsx  # Página de error
│   ├── context/           # Contextos React
│   │   ├── AuthContext.jsx      # Gestión autenticación
│   │   ├── FavoriteContext.jsx  # Gestión favoritos
│   │   └── NotificationContext.jsx # Notificaciones
│   ├── hooks/             # Custom Hooks
│   │   ├── useFetch.js           # Hook para peticiones HTTP
│   │   ├── useJoinEvent.js       # Hook para unirse a eventos
│   │   └── useRemoveParticipant.js # Hook para eliminar participante
│   ├── services/          # Servicios API
│   │   └── fetchService.js # Servicio principal de API
│   ├── layouts/           # Layouts de la aplicación
│   │   └── RootLayout.jsx # Layout principal
│   ├── router/            # Configuración de rutas
│   │   └── index.jsx      # Router principal
│   ├── utils/             # Utilidades
│   ├── constants/         # Constantes de la aplicación
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
├── eslint.config.js       # Configuración ESLint
├── index.html             # HTML base
├── Dockerfile             # Imagen Docker
└── README.md              # Documentación
```

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev
# o
npm start

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## ⚙️ Configuración

1. **Variables de entorno:**
   ```bash
   # Crea un archivo .env en la raíz del frontend
   echo "VITE_BACKEND_URL=http://localhost:3000" > .env
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar desarrollo:**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación:**
   ```
   http://localhost:5173
   ```

## 🎨 Tecnologías y Librerías

### **Core**
- **React 19** - Biblioteca principal
- **Vite 6** - Build tool y dev server
- **React Router DOM 7** - Navegación

### **UI y Estilos**
- **Tailwind CSS 4** - Framework CSS utility-first
- **Lucide React** - Iconos modernos
- **React Icons** - Biblioteca de iconos
- **React Spinners** - Indicadores de carga

### **Mapas y Geolocalización**
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración con React

### **Desarrollo**
- **ESLint** - Linter para código limpio
- **TypeScript** (tipos) - Tipado estático

## 🏗️ Arquitectura

### **Gestión de Estado**
- **React Context** para estado global
- **Custom Hooks** para lógica reutilizable
- **Local State** con useState para estado local

### **Patrones de Componentes**
```
src/components/
├── ui/           # Componentes básicos (Button, Input, Modal)
├── auth/         # Específicos de autenticación
├── events/       # Específicos de eventos
└── profile/      # Específicos de perfil
```

### **Flujo de Datos**
```
API ← fetchService ← Hooks ← Pages/Components
                  ↓
                Context (Estado Global)
```

## 🔐 Autenticación

- **JWT Tokens** almacenados en cookies HTTP-only
- **AuthContext** para gestión global
- **Rutas protegidas** según roles (user/admin)

## 🗺️ Funcionalidades Principales

### **Para Usuarios**
- ✅ Registro e inicio de sesión
- ✅ Crear eventos (participativos e informativos)
- ✅ Unirse a eventos
- ✅ Sistema de favoritos
- ✅ Visualización en mapa
- ✅ Perfil personalizable
- ✅ Búsqueda y filtros

### **Para Administradores**
- ✅ Panel de administración
- ✅ Gestión de usuarios
- ✅ Gestión de eventos
- ✅ Estadísticas

## 🐳 Docker

Para ejecutar con Docker:

```bash
# Desde la raíz del proyecto
docker-compose up frontend

# O desde el directorio frontend
docker build -t joinup-frontend .
docker run -p 5173:5173 joinup-frontend
```

## 🔧 Configuración Avanzada

### **Vite Config**
- Configurado para React con SWC
- Hot Module Replacement habilitado
- Optimizaciones de build

### **ESLint**
- Reglas para React Hooks
- Configuración moderna
- Auto-refresh en desarrollo

## 🌐 Variables de Entorno

```env
# .env
VITE_BACKEND_URL=http://localhost:3000
VITE_APP_ENV=development
```

## 📱 Responsive Design

- **Mobile First** - Diseño optimizado para móviles
- **Breakpoints Tailwind** - sm, md, lg, xl, 2xl
- **Componentes adaptables** - Se ajustan a cualquier pantalla

## 🚀 Performance

- **Code Splitting** automático con React Router
- **Lazy Loading** de componentes
- **Optimización de imágenes**
- **Bundle optimizado** con Vite

## 🧪 Desarrollo

### **Estructura recomendada para nuevos componentes:**
```jsx
// src/components/ui/Button.jsx
import { forwardRef } from 'react';

const Button = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`base-styles ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
```

### **Custom Hook típico:**
```jsx
// src/hooks/useExample.js
import { useState, useEffect } from 'react';

export const useExample = (dependency) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Lógica del hook
  }, [dependency]);
  
  return { data, loading };
};
```

¡Disfruta desarrollando en JoinUp! 🎉
