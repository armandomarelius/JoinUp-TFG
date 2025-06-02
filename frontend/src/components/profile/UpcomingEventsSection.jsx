import { useFetch } from "../../hooks/useFetch";
import { getParticipatingEvents } from "../../services/fetchService";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from 'lucide-react';

const UpcomingEventsSection = () => {
  const { data: participatingEvents, loading } = useFetch(getParticipatingEvents);
  
  // Filtrar eventos próximos (fechas futuras) en los que participa
  const upcomingEvents = participatingEvents?.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate > now; // Solo eventos futuros
  }).sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordenar por fecha
    .slice(0, 5); // Solo los próximos 5

  if (loading) {
    return <div className="text-center py-4 text-sky-500">Cargando próximos eventos...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-bold text-sky-700">Mis próximos eventos</h3>
      </div>
      
      {!upcomingEvents?.length ? (
        <div className="text-center py-6 text-gray-500">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm">No tienes eventos próximos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-sky-200"
            >
              {/* Fecha destacada */}
              <div className="text-center bg-sky-50 rounded-lg p-3 min-w-[60px]">
                <div className="text-lg font-bold text-sky-600">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-xs text-sky-500 uppercase font-medium">
                  {new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}
                </div>
              </div>
              
              {/* Info del evento */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate mb-1">{event.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.date).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{event.location}</span>
                  </span>
                </div>
              </div>
              
              {/* Indicador visual */}
              <div className="w-2 h-8 bg-sky-500 rounded-full"></div>
            </Link>
          ))}
          
          {participatingEvents?.length > 5 && (
            <Link 
              to="/profile" 
              className="block text-center text-sky-600 hover:text-sky-800 text-sm font-medium py-2"
            >
              Ver todos mis eventos →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsSection; 