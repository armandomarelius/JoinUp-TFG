import { useState, useEffect } from "react";
import LocationPicker from "../ui/Location";
import { CATEGORIES, PARTICIPATION_TYPES } from "../../constants/categories";
import { formatDateForInput } from "../../utils/dateUtils";

const EditEventModal = ({ event, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
    max_participants: "",
    participation_type: "",
  });
  
  // Estados para la ubicación 
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 37.1773, lng: -3.5986 }); // Granada por defecto
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar formulario cuando cambie el evento
  useEffect(() => {
    if (event && isOpen) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        date: formatDateForInput(event.date),
        category: event.category || "",
        max_participants: event.max_participants || "",
        participation_type: event.participation_type || "participative",
      });
      
      // Inicializar ubicación y coordenadas
      setLocation(event.location || '');
      setCoordinates(event.coordinates || { lat: 37.1773, lng: -3.5986 });
      
      setError(null);
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Solo enviar campos que han cambiado o son requeridos
      const updatedData = {};
      
      // Comparar cada campo y solo incluir los que han cambiado
      if (form.title !== event.title) updatedData.title = form.title;
      if (form.description !== event.description) updatedData.description = form.description;
      if (form.category !== event.category) updatedData.category = form.category;
      
      // Comparar ubicación y coordenadas
      if (location !== event.location) updatedData.location = location;
      if (coordinates.lat !== event.coordinates?.lat || coordinates.lng !== event.coordinates?.lng) {
        updatedData.coordinates = coordinates;
      }
      
      // Para max_participants, solo incluir si el evento es participativo
      if (event.participation_type === "participative") {
        const newMaxParticipants = form.max_participants ? parseInt(form.max_participants) : null;
        const currentMaxParticipants = event.max_participants || null;
        if (newMaxParticipants !== currentMaxParticipants) {
          updatedData.max_participants = newMaxParticipants;
        }
      }
      
      // Para la fecha, comparar las fechas formateadas
      if (form.date !== formatDateForInput(event.date)) {
        updatedData.date = new Date(form.date).toISOString();
      }

      // Si no hay cambios, cerrar el modal sin hacer nada
      if (Object.keys(updatedData).length === 0) {
        onClose();
        return;
      }

      await onSave(updatedData);
      onClose();
    } catch (updateError) {
      setError(updateError.message || "Error al actualizar el evento");
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha mínima (ahora + 1 hora para dar margen)
  const getMinDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // 1 hora en el futuro mínimo
    return now.toISOString().slice(0, 16); // formato YYYY-MM-DDTHH:MM
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" 
          onClick={onClose}
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-sky-700">Editar evento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input 
              id="title"
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
              placeholder="Título del evento" 
              required 
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea 
              id="description"
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
              placeholder="Descripción del evento" 
              required 
            />
          </div>

          {/* Ubicación con LocationPicker */}
          <LocationPicker
            location={location}
            setLocation={setLocation}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />

          {/* Fecha y hora */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y hora
            </label>
            <input 
              id="date"
              name="date" 
              type="datetime-local" 
              value={form.date} 
              onChange={handleChange} 
              min={getMinDate()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
              required 
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select 
              id="category"
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
              required
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>

          {/* Tipo de participación - SOLO LECTURA */}
          <div>
            <label htmlFor="participation_type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de evento
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600">
              {event?.participation_type === "participative" ? "Participativo" : "Informativo"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              El tipo de evento no se puede cambiar una vez creado
            </p>
          </div>

          {/* Máximo participantes - Solo mostrar si es participativo */}
          {event?.participation_type === "participative" && (
            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de participantes
              </label>
              <input 
                id="max_participants"
                name="max_participants" 
                type="number" 
                value={form.max_participants} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                placeholder="Número máximo de participantes" 
                min="1" 
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
