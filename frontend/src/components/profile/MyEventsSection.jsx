import { useEffect, useState } from "react";
import { getEventsByUser, updateEvent, deleteEvent, updateEventStatus } from "../../services/fetchService";
import EditEventModal from "../events/EditEventModal";
import CategoryIcons from "../ui/CategoryIcons";
import { formatDateForDisplay } from "../../utils/dateUtils";
import ConfirmationModal from "../ui/ConfirmationModal";

const MyEventsSection = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(false);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const events = await getEventsByUser();
        setMyEvents(events);
      } catch (fetchError) {
        setError("Error al cargar tus eventos");
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveEvent = async (formData) => {
    const updatedEvent = await updateEvent(editingEvent._id, formData);
    
    setMyEvents(currentEvents =>
      currentEvents.map(event =>
        event._id === editingEvent._id ? updatedEvent : event
      )
    );
    
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const confirmDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const executeDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    setDeletingEvent(true);
    try {
      await deleteEvent(eventToDelete._id);
      setMyEvents(currentEvents =>
        currentEvents.filter(event => event._id !== eventToDelete._id)
      );
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (deleteError) {
      setError('Error al eliminar el evento');
      console.error(deleteError);
    } finally {
      setDeletingEvent(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    setUpdatingStatusId(eventId);
    try {
      await updateEventStatus(eventId, newStatus);
      setMyEvents(currentEvents =>
        currentEvents.map(event =>
          event._id === eventId ? { ...event, status: newStatus } : event
        )
      );
      setOpenMenuId(null);
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'close': return 'bg-yellow-100 text-yellow-700';
      case 'finished': return 'bg-gray-100 text-gray-700';
      default: return 'bg-sky-100 text-sky-700';
    }
  };

  const canChangeStatus = (event) => {
    const now = new Date();
    return event.status !== 'finished' && new Date(event.date) > now;
  };

  if (loading) return <div className="text-center py-8 text-sky-500">Cargando tus eventos...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-sky-700">Eventos creados por mi</h2>
      {myEvents.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No has creado ningún evento todavía.</div>
      ) : (
        <div className="space-y-4">
          {myEvents.map(event => (
            <div key={event._id} className="bg-white rounded-xl shadow p-4 border border-sky-100">
              <div className="flex gap-4 items-start">
                {/* Imagen del evento o placeholder */}
                <div className="flex-shrink-0">
                  {event.image?.url ? (
                    <img
                      src={event.image.url}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-sky-100 flex items-center justify-center">
                      <CategoryIcons 
                        category={event.category} 
                        className="w-8 h-8 text-sky-600" 
                      />
                    </div>
                  )}
                </div>

                {/* Contenido del evento */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span>📍</span>
                          <span className="truncate max-w-32">{event.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{formatDateForDisplay(event.date)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👥</span>
                          <span>{event.participants?.length || 0} participantes</span>
                        </span>
                        <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Menú desplegable */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === event._id ? null : event._id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {openMenuId === event._id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-40">
                          <button
                            onClick={() => handleEditClick(event)}
                            disabled={event.status === 'finished'}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          
                          {/* Opciones de cambio de estado */}
                          {canChangeStatus(event) && (
                            <>
                              {event.status === 'open' && (
                                <button
                                  onClick={() => handleStatusChange(event._id, 'close')}
                                  disabled={updatingStatusId === event._id}
                                  className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  Cerrar evento
                                </button>
                              )}
                              {event.status === 'close' && (
                                <button
                                  onClick={() => handleStatusChange(event._id, 'open')}
                                  disabled={updatingStatusId === event._id}
                                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                  Abrir evento
                                </button>
                              )}
                            </>
                          )}
                          
                          <button
                            onClick={() => confirmDeleteEvent(event)}
                            disabled={event.status === 'finished'}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditEventModal
        event={editingEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
        }}
        onConfirm={executeDeleteEvent}
        title="Eliminar evento"
        message={`¿Estás seguro de que quieres eliminar "${eventToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={deletingEvent}
      />
    </div>
  );
};

export default MyEventsSection;
