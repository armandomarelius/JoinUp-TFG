import { useEffect, useState } from "react";
import {
  adminGetAllUsers,
  adminGetAllEvents,
  adminDeleteEvent,
  adminToggleUserStatus
} from "../services/fetchService";
import { User, ShieldCheck, Ban, RefreshCw, Trash2, Search } from "lucide-react";
import { formatDateTimeForDisplay } from "../utils/dateUtils";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const badge = (text, color) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
    {text}
  </span>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para búsqueda
  const [userSearch, setUserSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  // Estados para modal de confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, eventsData] = await Promise.all([
        adminGetAllUsers(),
        adminGetAllEvents()
      ]);
      setUsers(usersData);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEvent = async (eventId, eventTitle) => {
    // Abrir modal de confirmación
    setEventToDelete({ id: eventId, title: eventTitle });
    setModalOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    setDeleteLoading(true);
    try {
      await adminDeleteEvent(eventToDelete.id);
      
      //  Eliminar solo el evento específico del estado local
      setEvents(prevEvents => 
        prevEvents.filter(event => event._id !== eventToDelete.id)
      );
      
      // Cerrar modal
      setModalOpen(false);
      setEventToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeModal = () => {
    if (!deleteLoading) {
      setModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await adminToggleUserStatus(userId);
      
      //  Actualizar solo el usuario específico en el estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isActive: !user.isActive } // Toggle del estado
            : user
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filtrar eventos por búsqueda
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(eventSearch.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      <h1 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 text-center drop-shadow">
        Panel de Administración
      </h1>
      
      {/* Usuarios */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="text-sky-600" />
              <h2 className="text-2xl font-bold text-sky-800">Usuarios</h2>
              <span className="text-sm text-gray-500">({filteredUsers.length}/{users.length})</span>
            </div>
            
            {/* Buscador de usuarios */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sky-50">
                <tr>
                  <th className="py-2 px-3">Usuario</th>
                  <th className="py-2 px-3">Rol</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      {userSearch ? "No se encontraron usuarios" : "No hay usuarios"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-sky-50 border-b last:border-b-0 transition">
                      <td className="py-2 px-3 font-medium">{user.username}</td>
                      <td className="py-2 px-3">
                        {user.isAdmin
                          ? badge("Admin", "indigo")
                          : badge("Usuario", "sky")}
                      </td>
                      <td className="py-2 px-3">
                        {user.isActive
                          ? badge("Activo", "green")
                          : badge("Suspendido", "red")}
                      </td>
                      <td className="py-2 px-3">
                        {!user.isAdmin && (
                          <button
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition
                              ${user.isActive
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                            onClick={() => handleToggleUser(user._id)}
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="w-4 h-4" /> Suspender
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4" /> Reactivar
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Eventos */}
      <section>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-sky-600" />
              <h2 className="text-2xl font-bold text-sky-800">Eventos</h2>
              <span className="text-sm text-gray-500">({filteredEvents.length}/{events.length})</span>
            </div>
            
            {/* Buscador de eventos */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar evento..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sky-50">
                <tr>
                  <th className="py-2 px-3">Título</th>
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      {eventSearch ? "No se encontraron eventos" : "No hay eventos"}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map(event => (
                    <tr key={event._id} className="hover:bg-sky-50 border-b last:border-b-0 transition">
                      <td className="py-2 px-3 font-medium">{event.title}</td>
                      <td className="py-2 px-3">{formatDateTimeForDisplay(event.date)}</td>
                      <td className="py-2 px-3">
                        <button
                          className="inline-flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full text-xs font-semibold transition"
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteEvent}
        title="Eliminar Evento"
        message={
          eventToDelete ? (
            <div className="space-y-2">
              <p>¿Estás seguro de que quieres eliminar el evento:</p>
              <p className="font-semibold text-gray-900">"{eventToDelete.title}"</p>
            </div>
          ) : null
        }
        confirmText="Eliminar"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminDashboard;
