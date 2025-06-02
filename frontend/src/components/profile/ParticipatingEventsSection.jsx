import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { getParticipatingEvents, leaveEvent } from "../../services/fetchService";
import CategoryIcons from "../ui/CategoryIcons";
import UserAvatar from "../ui/UserAvatar";
import { formatDateForDisplay } from "../../utils/dateUtils";
import { Calendar, History, MapPin, Users } from 'lucide-react';
import ConfirmationModal from "../ui/ConfirmationModal";

const ParticipatingEventsSection = () => {
  const { data: participatingEvents, loading, error } = useFetch(getParticipatingEvents);
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  
  // Estados para abandonar evento (solo eventos futuros)
  const [leavingEventId, setLeavingEventId] = useState(null);
  const [leaveError, setLeaveError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [eventToLeave, setEventToLeave] = useState(null);

  useEffect(() => {
    if (participatingEvents) {
      setEvents(participatingEvents);
    }
  }, [participatingEvents]);

  // Filtrar eventos
  const getFilteredEvents = () => {
    if (!events) return [];
    
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return events.filter(event => new Date(event.date) > now && event.status !== 'finished');
      case 'finished':
        return events.filter(event => new Date(event.date) <= now || event.status === 'finished');
      default:
        return events.sort((a, b) => new Date(b.date) - new Date(a.date)); // Más recientes primero
    }
  };

  // Funciones para abandonar evento (solo para eventos futuros)
  const confirmLeaveEvent = (event) => {
    setEventToLeave(event);
    setShowLeaveModal(true);
  };

  const executeLeaveEvent = async () => {
    if (!eventToLeave) return;

    setLeavingEventId(eventToLeave._id);
    setLeaveError(null);
    
    try {
      await leaveEvent(eventToLeave._id);
      setEvents(currentEvents => 
        currentEvents ? currentEvents.filter(event => event._id !== eventToLeave._id) : []
      );
      setShowLeaveModal(false);
      setEventToLeave(null);
    } catch (error) {
      setLeaveError(error.message);
    } finally {
      setLeavingEventId(null);
    }
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className="text-center py-8 text-sky-500">
        Cargando historial de participaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
        {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {leaveError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {leaveError}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'all' 
              ? 'bg-sky-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos ({events?.length || 0})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'upcoming' 
              ? 'bg-sky-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Próximos ({events?.filter(e => new Date(e.date) > new Date() && e.status !== 'finished').length || 0})
        </button>
        <button
          onClick={() => setFilter('finished')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            filter === 'finished' 
              ? 'bg-sky-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Finalizados ({events?.filter(e => new Date(e.date) <= new Date() || e.status === 'finished').length || 0})
        </button>
      </div>

      {/* Lista de eventos */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <History className="w-16 h-16 text-gray-400" />
          </div>
          <div className="text-gray-500 mb-4">
            {filter === 'all' && "No tienes historial de participaciones todavía."}
            {filter === 'upcoming' && "No tienes eventos próximos."}
            {filter === 'finished' && "No tienes eventos finalizados."}
          </div>
          <Link
            to="/events"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Explorar Eventos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map(event => {
            const eventDate = new Date(event.date);
            const isUpcoming = eventDate > new Date() && event.status !== 'finished';
            const isFinished = eventDate <= new Date() || event.status === 'finished';

            return (
              <div 
                key={event._id} 
                className={`rounded-xl p-4 border transition-shadow hover:shadow-md ${
                  isFinished 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-sky-50 border-sky-100'
                }`}
              >
                <div className="flex gap-4 items-start">
                  {/* Imagen del evento */}
                  <div className="flex-shrink-0">
                    {event.image?.url ? (
                      <img
                        src={event.image.url}
                        alt={event.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                        isFinished ? 'bg-gray-200' : 'bg-sky-100'
                      }`}>
                        <CategoryIcons 
                          category={event.category} 
                          className={`w-8 h-8 ${isFinished ? 'text-gray-500' : 'text-sky-600'}`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Contenido del evento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${
                            isFinished ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {event.title}
                          </h3>
                          {/* Badge de estado */}
                          {isUpcoming && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Próximo
                            </span>
                          )}
                          {isFinished && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              Finalizado
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mb-2 line-clamp-2 ${
                          isFinished ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Información del evento */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-32">{event.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateForDisplay(event.date)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.participants?.length || 0} participantes</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isFinished 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-sky-100 text-sky-700'
                      }`}>
                        {event.category}
                      </span>
                    </div>

                    {/* Organizador */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500">Organizado por:</span>
                      <div className="flex items-center gap-2">
                        <UserAvatar user={event.created_by} size="sm" />
                        <span className="text-sm font-medium text-gray-700">
                          {event.created_by?.username || 'Usuario'}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/events/${event._id}`}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                          isFinished
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-sky-500 hover:bg-sky-600 text-white'
                        }`}
                      >
                        Ver Detalles
                      </Link>
                      
                      {/* Solo mostrar botón de abandonar para eventos futuros */}
                      {isUpcoming && (
                        <button
                          onClick={() => confirmLeaveEvent(event)}
                          disabled={leavingEventId === event._id}
                          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                            leavingEventId === event._id
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-100 hover:bg-red-200 text-red-700"
                          }`}
                        >
                          {leavingEventId === event._id ? "Abandonando..." : "Abandonar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setEventToLeave(null);
        }}
        onConfirm={executeLeaveEvent}
        title="Abandonar evento"
        message={`¿Estás seguro de que quieres abandonar "${eventToLeave?.title}"?`}
        confirmText="Abandonar"
        isLoading={leavingEventId === eventToLeave?._id}
      />
    </div>
  );
};

export default ParticipatingEventsSection; 