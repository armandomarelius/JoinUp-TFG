import { Link } from "react-router-dom";
import { Lock, Users, Calendar, MapPin, User, Heart } from 'lucide-react';
import UserAvatar from '../ui/UserAvatar';
import { useFavorites } from '../../context/FavoriteContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const EventCard = ({ event }) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Calcular si el evento está lleno
  const isEventFull = event.participation_type !== 'informative' && 
                      event.max_participants && 
                      event.participants?.length >= event.max_participants;

  // Manejar click en favoritos
  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevenir navegación del Link
    e.stopPropagation(); // Evitar que se propague el click
    
    if (!isAuthenticated) return;
    
    try {
      setIsTogglingFavorite(true);
      await toggleFavorite(event._id);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Link 
      to={`/events/${event._id}`}
      className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block transform`}
    >
      {/* Botón de favoritos */}
      {isAuthenticated && (
        <button
          onClick={handleFavoriteClick}
          disabled={loading || isTogglingFavorite}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isFavorite(event._id)
              ? 'bg-red-500/90 text-white hover:bg-red-600/90'
              : 'bg-white/90 text-gray-400 hover:bg-white hover:text-red-500'
          } ${(loading || isTogglingFavorite) ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isFavorite(event._id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-200 ${
              isFavorite(event._id) ? 'fill-current' : ''
            }`} 
          />
        </button>
      )}

      {/* Mostrar "COMPLETO" si está lleno */}
      {isEventFull && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Lock className="w-3 h-3" />
            COMPLETO
          </div>
        </div>
      )}

      {event.image?.url && (
        <img
          src={event.image.url}
          alt={event.title}
          className={`w-full h-40 object-cover transition-transform duration-300 hover:scale-105 ${
            isEventFull ? 'opacity-75' : ''
          }`}
        />
      )}
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className={`text-lg font-semibold hover:text-sky-600 transition-colors line-clamp-2 ${
            isEventFull ? 'text-gray-600' : 'text-sky-800'
          }`}>
            {event.title}
          </h3>
          
          {/* Info con iconos  */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium">Fecha:</span>
            <span>{new Date(event.date).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
          
          {/* Ubicación  */}
          <div className="text-xs text-gray-400 mb-1">
            <div className="flex items-center gap-1 mb-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">Ubicación:</span>
            </div>
            <div className="pl-4 line-clamp-2" title={event.location}>
              {event.location}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span className="font-medium">Creado por:</span>
            <UserAvatar user={event.created_by} size="sm" />
            <span className="truncate">{event.created_by?.username || 'Usuario'}</span>
          </div>
        </div>
      </div>
      
      {/*  Contador de participantes  */}
      {event.participation_type !== 'informative' && (
        <div className={`absolute bottom-2 right-4 rounded-full px-3 py-1 text-xs shadow flex items-center gap-1 backdrop-blur-sm font-medium transition-all duration-200 ${
          isEventFull 
            ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
            : 'bg-white/90 text-gray-700 hover:bg-sky-50 hover:text-sky-700'
        }`}>
          {isEventFull ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Users className="w-3 h-3" />
          )}
          <span className={isEventFull ? 'font-bold' : ''}>
            {event.participants?.length || 0}
            {event.max_participants ? `/${event.max_participants}` : ''}
          </span>
        </div>
      )}
    </Link>
  );
};

export default EventCard;