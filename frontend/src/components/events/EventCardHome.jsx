import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDateTimeForDisplay } from "../../utils/dateUtils";
import CategoryIcons from '../ui/CategoryIcons';

const EventCardHome = ({ event }) => {
  return (
    <div className="flex-none w-80 bg-white rounded-xl shadow-lg overflow-hidden snap-start hover:shadow-xl transition-shadow duration-300">
      {/* Imagen del evento */}
      <div className="relative h-48">
        {event.image?.url ? (
          <img
            src={event.image.url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
            <CategoryIcons 
              category={event.category} 
              className="w-16 h-16 text-sky-600 opacity-60" 
            />
          </div>
        )}
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3 bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          {event.category}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>
        
        {/* Información del evento con iconos de Lucide */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4 flex-shrink-0 text-sky-600" />
            <span>{formatDateTimeForDisplay(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-4 h-4 flex-shrink-0 text-sky-600" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Users className="w-4 h-4 flex-shrink-0 text-sky-600" />
            <span>{event.participants?.length || 0} participantes</span>
          </div>
        </div>

        {/* Botón ver detalles */}
        <Link
          to={`/events/${event._id}`}
          className="block w-full bg-sky-500 hover:bg-sky-600 text-white text-center py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
};

export default EventCardHome;
