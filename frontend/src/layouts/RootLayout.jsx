import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; 
import { useNotifications } from '../context/NotificationContext';
import { Bell, Menu, Xmark } from "iconoir-react";
import ScrollToTop from '../components/ui/ScrollToTop';
import { useState } from 'react';

// Clases simplificadas y consistentes
const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-sky-700 text-white"
      : "text-sky-900 hover:bg-sky-200 hover:text-sky-800"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-md text-base font-medium transition-colors ${
    isActive
      ? "bg-sky-700 text-white"
      : "text-sky-900 hover:bg-sky-200 hover:text-sky-800"
  }`;

const RootLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { pendingRequestsCount } = useNotifications();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false); // Cerrar menú al hacer logout
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNotifications = () => {
    navigate('/profile', { state: { activeTab: 'requests' } });
    setIsMobileMenuOpen(false); // Cerrar menú al navegar
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo - siempre visible */}
              <div className="flex-shrink-0">
                <NavLink to="/" className="text-xl sm:text-2xl font-bold text-sky-700 tracking-tight">
                  JoinUp
                </NavLink>
              </div>

              {/* Navegación Desktop (lg+) */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="flex space-x-1">
                  <NavLink to="/events" className={navLinkClass}>
                    Eventos
                  </NavLink>
                  <NavLink to="/create-event" className={navLinkClass}>
                    Crear Evento
                  </NavLink>
                  <NavLink to="/about" className={navLinkClass}>
                    Sobre Nosotros
                  </NavLink>
                  {isAuthenticated && (
                    <NavLink to="/profile" className={navLinkClass}>
                      Mi Perfil
                    </NavLink>
                  )}
                  {isAuthenticated && user?.isAdmin && (
                    <NavLink to="/admin" className={navLinkClass}>
                      Admin
                    </NavLink>
                  )}
                </div>
              </div>

              {/* Autenticación Desktop (lg+) */}
              <div className="hidden lg:flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-sky-800 hidden xl:block">
                      Hola, {user?.username}
                    </span>
                    <button
                      onClick={handleNotifications}
                      className="p-2 text-sky-800 hover:text-sky-600 transition-colors relative"
                      aria-label="Notificaciones"
                    >
                      <Bell className="h-5 w-5" />
                      {pendingRequestsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                          {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-500 hover:bg-gray-700 px-3 py-2 rounded-md text-sm text-white transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <NavLink
                      to="/login"
                      className="bg-sky-500 hover:bg-sky-600 px-3 py-2 rounded-md text-sm text-white transition-colors"
                    >
                      Iniciar sesión
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="bg-sky-400 hover:bg-sky-500 px-3 py-2 rounded-md text-sm text-white transition-colors"
                    >
                      Registrarse
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Controles Móvil/Tablet (hasta lg) */}
              <div className="lg:hidden flex items-center space-x-2">
                {isAuthenticated && (
                  <button
                    onClick={handleNotifications}
                    className="p-2 text-sky-800 hover:text-sky-600 transition-colors relative"
                    aria-label="Notificaciones"
                  >
                    <Bell className="h-6 w-6" />
                    {pendingRequestsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-sky-800 hover:text-sky-600 transition-colors"
                  aria-label="Menú"
                >
                  {isMobileMenuOpen ? (
                    <Xmark className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Menú móvil mejorado */}
            {isMobileMenuOpen && (
              <div className="lg:hidden">
                <div className="px-2 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200 shadow-lg">
                  {/* Navegación móvil */}
                  <div className="space-y-1">
                    <NavLink 
                      to="/events" 
                      className={mobileNavLinkClass}
                      onClick={closeMobileMenu}
                    >
                      Eventos
                    </NavLink>
                    <NavLink 
                      to="/create-event" 
                      className={mobileNavLinkClass}
                      onClick={closeMobileMenu}
                    >
                      Crear Evento
                    </NavLink>
                    <NavLink 
                      to="/about" 
                      className={mobileNavLinkClass}
                      onClick={closeMobileMenu}
                    >
                      Sobre Nosotros
                    </NavLink>
                    {isAuthenticated && (
                      <NavLink 
                        to="/profile" 
                        className={mobileNavLinkClass}
                        onClick={closeMobileMenu}
                      >
                        Mi Perfil
                      </NavLink>
                    )}
                    {isAuthenticated && user?.isAdmin && (
                      <NavLink 
                        to="/admin" 
                        className={mobileNavLinkClass}
                        onClick={closeMobileMenu}
                      >
                        Admin
                      </NavLink>
                    )}
                  </div>
                  
                  {/* Autenticación móvil */}
                  <div className="border-t border-gray-200 pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="px-4 py-2 bg-sky-50 rounded-md">
                          <span className="text-sm text-sky-800 font-medium">
                            Hola, {user?.username}
                          </span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full bg-gray-500 hover:bg-gray-700 px-4 py-3 rounded-md text-base text-white transition-colors"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <NavLink
                          to="/login"
                          className="block bg-sky-500 hover:bg-sky-600 px-4 py-3 rounded-md text-base text-white transition-colors text-center"
                          onClick={closeMobileMenu}
                        >
                          Iniciar sesión
                        </NavLink>
                        <NavLink
                          to="/register"
                          className="block bg-sky-400 hover:bg-sky-500 px-4 py-3 rounded-md text-base text-white transition-colors text-center"
                          onClick={closeMobileMenu}
                        >
                          Registrarse
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
        
        {/* Contenido principal mejorado */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Outlet />
        </main>
        
        {/* Footer responsive mejorado */}
        <footer className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Logo y descripción */}
              <div className="sm:col-span-2 lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  JoinUp
                </h2>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Conectando personas a través de eventos y experiencias compartidas. 
                  Únete a nuestra comunidad y descubre nuevas oportunidades.
                </p>
                {/* Redes sociales simplificadas */}
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Enlaces rápidos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-sky-400">Enlaces</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <NavLink to="/" className="text-gray-300 hover:text-sky-400 transition-colors">
                      Inicio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/about" className="text-gray-300 hover:text-sky-400 transition-colors">
                      Sobre Nosotros
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/events" className="text-gray-300 hover:text-sky-400 transition-colors">
                      Eventos
                    </NavLink>
                  </li>
                  <li>
                    <a href="mailto:info@joinup.com" className="text-gray-300 hover:text-sky-400 transition-colors">
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-sky-400">Contacto</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    info@joinup.com
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    + 123 345 6789
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Granada, España
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright simplificado */}
            <div className="border-t border-gray-700 mt-8 pt-6">
              <p className="text-gray-300 text-sm text-center">
                © 2025 JoinUp. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RootLayout;