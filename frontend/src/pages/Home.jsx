import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUpcomingEvents, getNearbyEvents } from "../services/fetchService";
import EventCarousel from "../components/ui/EventCarousel";
import { MapPin } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState(null);
  const [nearbyError, setNearbyError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Función para obtener la ubicación del usuario
  const getUserLocation = async () => {
    // 1. INTENTAR GPS PRIMERO (funciona bien en móviles)
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,    // Forzar GPS real
              timeout: 15000,             // Dar más tiempo para GPS
              maximumAge: 0               // No usar caché
            }
          );
        });

        const { latitude, longitude, accuracy } = position.coords;

        // CRITERIOS DE PRECISIÓN GPS:
        if (accuracy <= 1000) {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            source: 'GPS',
            accuracy: Math.round(accuracy)
          });
          return;
        } else {
          // GPS muy impreciso, mejor usar IP
          console.error("GPS demasiado impreciso, intentando IP geolocation");
        }

      } catch (gpsError) {
        console.error("❌ Error en GPS:", gpsError);
      }
    } else {
      console.error("❌ GPS no disponible");
    }

    // 2. FALLBACK: IP GEOLOCATION (rango fijo 250km)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.latitude && data.longitude && !data.error) {
        setUserLocation({
          lat: data.latitude,
          lng: data.longitude,
          city: data.city,
          country: data.country_name,
          radius: 250, // RANGO FIJO DE 250KM PARA IP
          source: 'IP'
        });
        return;
      } else {
        console.error("❌ Error en IP Geolocation:", data);
      }
    } catch (ipError) {
      console.error("❌ Error en IP Geolocation:", ipError);
    }

    // 3. ÚLTIMO FALLBACK: GRANADA POR DEFECTO
    setUserLocation({
      lat: 37.1773,
      lng: -3.5986,
      city: 'Granada',
      country: 'Spain',
      radius: 200,
      source: 'fallback'
    });
  };

  useEffect(() => {
    // Obtener ubicación del usuario
    getUserLocation();

    // Obtener eventos próximos
    const fetchUpcomingEvents = async () => {
      try {
        setUpcomingLoading(true);
        const events = await getUpcomingEvents(8);
        setUpcomingEvents(events);
      } catch (fetchError) {
        setUpcomingError("Error al cargar los eventos próximos");
        console.error(" Error eventos próximos:", fetchError);
      } finally {
        setUpcomingLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Obtener eventos cercanos cuando tengamos la ubicación
  useEffect(() => {
    if (userLocation) {
      const fetchNearbyEvents = async () => {
        try {
          setNearbyLoading(true);

          const radius = userLocation.radius || 50;
          // Agregar límite de 6 eventos cercanos
          const events = await getNearbyEvents(userLocation.lat, userLocation.lng, radius, 8);

          setNearbyEvents(events);
        } catch (fetchError) {
          setNearbyError("Error al cargar los eventos cercanos");
          console.error(" Error eventos cercanos:", fetchError);
        } finally {
          setNearbyLoading(false);
        }
      };

      fetchNearbyEvents();
    }
  }, [userLocation]);

  // Si ambos están cargando, mostrar un loading general de página completa
  if (upcomingLoading && nearbyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size={20} 
          message="Cargando eventos..." 
          color="#0ea5e9" 
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero con imagen de fondo - MEJORADO */}
      <div className="relative h-[280px] sm:h-[350px] md:h-[450px] flex items-center justify-center">
        <img
          src="/img/fondo.webp"
          alt="Fondo JoinUp"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg">
            ¡Bienvenido a JoinUp!
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-2xl mb-4 md:mb-6 drop-shadow px-2">
            Descubre, crea y comparte planes únicos en tu ciudad.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              to="/create-event"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transition text-sm sm:text-base"
            >
              Crear un Evento
            </Link>
            <Link
              to="/events"
              className="bg-white/80 hover:bg-white text-sky-700 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transition text-sm sm:text-base"
            >
              Ver todos los eventos
            </Link>
          </div>
        </div>
        {/* Overlay para oscurecer la imagen y */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-900/40 to-transparent"></div>
      </div>

      {/* Próximos Eventos */}
      <EventCarousel
        events={upcomingEvents}
        title="Próximos Eventos Destacados"
        loading={upcomingLoading}
        error={upcomingError}
        emptyMessage="No hay eventos próximos disponibles."
      />

      {/* Eventos Cercanos  */}
      <div className="px-2 sm:px-4">
        <EventCarousel
          events={nearbyEvents}
          title={
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-lg sm:text-xl md:text-2xl">Eventos Cerca de Ti</span>
              {userLocation && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-sky-100 text-sky-800 border border-sky-200">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{userLocation.city || "tu ubicación"}, {userLocation.country}</span>
                  <span className="sm:hidden">{userLocation.city || "cerca"}</span>
                </span>
              )}
            </div>
          }
          loading={nearbyLoading}
          error={nearbyError}
          emptyMessage="No hay eventos cercanos a tu ubicación."
        />
      </div>

      {/* Enlace para ver todos */}
      <div className="w-full py-6 md:py-8 bg-white">
        <div className="text-center px-4">
          <Link
            to="/events"
            className="inline-block bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold px-4 sm:px-6 py-2 rounded-xl transition text-sm sm:text-base"
          >
            Ver todos los eventos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;