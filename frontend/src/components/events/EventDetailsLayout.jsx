import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import EventLocationMap from "./EventLocationMap";
import CategoryIcons from '../ui/CategoryIcons';
import { useEventRequest } from "../../hooks/useJoinEvent";
import { useAuth } from "../../context/AuthContext";
import { formatDateForDisplay, formatDateTimeForDisplay } from "../../utils/dateUtils";
import UserAvatar from '../ui/UserAvatar';
import { useRemoveParticipant } from "../../hooks/useRemoveParticipant";
import { getMyRequests } from "../../services/fetchService";
import ConfirmationModal from '../ui/ConfirmationModal';

const EventDetailsLayout = ({ event, onEventUpdate }) => {
  const { sendJoinRequest, loading, error, success } = useEventRequest();
  const { user, isAuthenticated } = useAuth();
  const { handleRemoveParticipant, loading: removeLoading, error: removeError } = useRemoveParticipant();
  const [requestSent, setRequestSent] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  
  // Estado local para los participantes
  const [localParticipants, setLocalParticipants] = useState(event?.participants || []);
  
  // Actualizar participantes locales cuando cambie el evento
  useEffect(() => {
    if (event?.participants) {
      setLocalParticipants(event.participants);
    }
  }, [event?.participants]);
  
  // Comprobar si el usuario es el creador del evento
  const isCreator = isAuthenticated && user?._id === event?.created_by?._id;
  
  // Comprobar si el usuario ya es participante (usar participantes locales)
  const isParticipant = isAuthenticated && localParticipants?.some(
    participant => participant._id === user?._id
  );

  useEffect(() => {
    const checkPendingRequest = async () => {
      if (!isAuthenticated || !event?._id) return;
      try {
        const requests = await getMyRequests();
        const pending = requests.find(
          req => req.event._id === event._id && req.status === "pending"
        );
        setHasPendingRequest(!!pending);
      } catch (err) {
        setHasPendingRequest(false);
      }
    };
    checkPendingRequest();
  }, [isAuthenticated, event?._id]);

  const handleJoinEvent = async () => {
    const result = await sendJoinRequest(event._id);
    if (result) {
      setRequestSent(true);
    }
  };

  const confirmRemoveParticipant = (participant) => {
    setParticipantToRemove(participant);
    setShowConfirmModal(true);
  };

  const executeRemoveParticipant = async () => {
    if (!participantToRemove) return;
    
    const result = await handleRemoveParticipant(event._id, participantToRemove._id);
    if (result) {
      // Actualizar inmediatamente el estado local
      setLocalParticipants(prevParticipants => 
        prevParticipants.filter(participant => participant._id !== participantToRemove._id)
      );
      
      // Llamar a la función de actualización del padre si existe
      if (onEventUpdate) {
        onEventUpdate();
      }
      
      setShowConfirmModal(false);
      setParticipantToRemove(null);
      setShowManageModal(false);
    }
  };

  // Determinar el estado del botón
  const getButtonState = () => {
    // Verificar si el evento ha finalizado
    const isEventFinished = event?.status === 'finished';
    if (isCreator) return { text: "Eres el creador", disabled: true, className: "bg-gray-400" };
    
    // Si el usuario participa y el evento ha finalizado
    if (isParticipant && isEventFinished) {
      return { text: "Finalizado", disabled: true, className: "bg-gray-500" };
    }
    
    // Si el usuario participa pero el evento aún no ha finalizado
    if (isParticipant) return { text: "Ya participas", disabled: true, className: "bg-green-600" };
    // Si el evento está completo
    if (event?.max_participants && localParticipants?.length >= event.max_participants) {
      return { text: "Evento completo", disabled: true, className: "bg-gray-400" };
    }
    if (hasPendingRequest || requestSent || success) return { text: "Solicitud enviada", disabled: true, className: "bg-yellow-600" };
    if (loading) return { text: "Enviando solicitud...", disabled: true, className: "bg-sky-400" };
    return { text: "Unirse al evento", disabled: false, className: "bg-sky-600 hover:bg-sky-700" };
  };

  const buttonState = getButtonState();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header condicional */}
      {event?.image?.url ? (
        // Si hay imagen, mostrar el header completo
        <div className="relative h-96">
          <img
            src={event.image.url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Botón volver y título */}
          <div className="absolute top-0 left-0 right-0 p-6">
            <Link to="/events" className="inline-flex items-center text-white/90 hover:text-white transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a eventos
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{event?.title}</h1>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center gap-2">
                <CategoryIcons category={event?.category} className="w-4 h-4" />
                {event?.category}
              </span>
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                {event?.participation_type === "participative" ? "Participativo" : "Informativo"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Si no hay imagen, mostrar solo el título y categorías en un header compacto
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link to="/events" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a eventos
              </Link>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event?.title}</h1>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium flex items-center gap-2">
                  <CategoryIcons category={event?.category} className="w-4 h-4" />
                  {event?.category}
                </span>
                <span className="px-4 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
                  {event?.participation_type === "participative" ? "Participativo" : "Informativo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Información del creador */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center">
                <UserAvatar user={event?.created_by} size="lg" />
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    Creado por {event?.created_by?.username || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event?.creation_date && formatDateForDisplay(new Date(event.creation_date))}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">{event?.description}</p>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <EventLocationMap coordinates={event?.coordinates} location={event?.location} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Detalles del evento */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del evento</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha y hora</p>
                  <p className="font-medium text-gray-900">
                    {event?.date && formatDateTimeForDisplay(new Date(event.date))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                  <p className="font-medium text-gray-900">{event?.location}</p>
                </div>
                {event?.max_participants && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Máx. participantes</p>
                    <p className="font-medium text-gray-900">{event.max_participants}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <p className="font-medium text-gray-900">
                    {event?.status === "open" ? "Abierto" :
                      event?.status === "close" ? "Cerrado" : "Finalizado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Participantes + Botón si el evento es participativo */}
            {event?.participation_type === "participative" && (
              <>
                {/* Participantes */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Participantes</h2>
                    {isCreator && (
                      <button
                        onClick={() => setShowManageModal(true)}
                        className="text-sm text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        Gestionar
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {localParticipants?.map((participant, index) => (
                      <UserAvatar 
                        key={participant._id || index} 
                        user={participant} 
                        size="md"
                        className="hover:scale-105 transition-transform cursor-pointer"
                        title={participant.username}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón de acción con lógica actualizada */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={handleJoinEvent}
                    disabled={buttonState.disabled}
                    className={`w-full py-3 ${buttonState.className} text-white font-medium rounded-xl transition-colors`}
                  >
                    {buttonState.text}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de gestión de participantes */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header del modal */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Gestionar participantes
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {localParticipants?.length || 0} participante{(localParticipants?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Contenido del modal */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {localParticipants?.map((participant, index) => (
                  <div 
                    key={participant._id} 
                    className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <UserAvatar user={participant} size="md" />
                        {participant._id === event.created_by._id && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.455-1.746-.721-2.517zm.286 1.596c.324.8.63 1.631.91 2.49a.75.75 0 01-.84 1.067 40.905 40.905 0 01-1.446-.74c-.65-.378-1.262-.78-1.835-1.207a.75.75 0 01-.243-1.334 29.714 29.714 0 003.454-1.276zM10 15.665a29.034 29.034 0 003.455 1.276.75.75 0 01-.243 1.334 40.804 40.804 0 01-1.835 1.207 40.905 40.905 0 01-1.446.74.75.75 0 01-.84-1.067c.28-.859.586-1.69.91-2.49zm.714-2.49c.266.771.511 1.618.721 2.517.508-.29 1.026-.564 1.554-.82a.75.75 0 00.419-.74 41.029 41.029 0 00-.39-3.114A29.848 29.848 0 0010.714 13.175z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {participant.username}
                        </p>
                        {participant._id === event.created_by._id ? (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 013.305-2.033.75.75 0 00-.714-1.319 37 37 0 00-3.446 2.12A2.216 2.216 0 006 9.393v.38a31.293 31.293 0 00-4.28-1.746.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6 11.459a29.848 29.848 0 00-2.455-1.158 41.029 41.029 0 00-.39 3.114.75.75 0 00.419.74c.528.256 1.046.53 1.554.82-.21-.899-.455-1.746-.721-2.517zm.286 1.596c.324.8.63 1.631.91 2.49a.75.75 0 01-.84 1.067 40.905 40.905 0 01-1.446-.74c-.65-.378-1.262-.78-1.835-1.207a.75.75 0 01-.243-1.334 29.714 29.714 0 003.454-1.276zM10 15.665a29.034 29.034 0 003.455 1.276.75.75 0 01-.243 1.334 40.804 40.804 0 01-1.835 1.207 40.905 40.905 0 01-1.446.74.75.75 0 01-.84-1.067c.28-.859.586-1.69.91-2.49zm.714-2.49c.266.771.511 1.618.721 2.517.508-.29 1.026-.564 1.554-.82a.75.75 0 00.419-.74 41.029 41.029 0 00-.39-3.114A29.848 29.848 0 0010.714 13.175z" clipRule="evenodd" />
                              </svg>
                              Creador
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">Participante</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Solo mostrar botón eliminar si no es el creador */}
                    {participant._id !== event.created_by._id && (
                      <button
                        onClick={() => confirmRemoveParticipant(participant)}
                        disabled={removeLoading}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Eliminar participante"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Mensaje si no hay participantes para eliminar */}
              {localParticipants?.length === 1 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Solo tú participas en este evento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setParticipantToRemove(null);
        }}
        onConfirm={executeRemoveParticipant}
        title="Confirmar eliminación"
        message={
          <>
            ¿Estás seguro de que quieres eliminar a{' '}
            <span className="font-semibold text-gray-900">
              {participantToRemove?.username}
            </span>{' '}
            del evento? Esta acción no se puede deshacer.
          </>
        }
        confirmText="Eliminar"
        isLoading={removeLoading}
      />
      {/* error aquí si hay  */}
      {removeError && showConfirmModal && (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm pointer-events-auto">
              {removeError}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsLayout;