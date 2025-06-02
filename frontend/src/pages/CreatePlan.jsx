import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/ui/Location';
import { CATEGORIES, PARTICIPATION_TYPES } from '../constants/categories';
import { createEvent } from '../services/fetchService';

const CreatePlan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    requirements: '',
    category: 'tapeo',
    participation_type: 'participative',
    max_participants: '',
    image: null
  });
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 37.1773, lng: -3.5986 }); // Por defecto Granada
  const [preview, setPreview] = useState(null);

  // Cleanup para la preview de imagen
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar fecha no sea en el pasado
      const selectedDate = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      
      if (selectedDate <= now) {
        throw new Error('La fecha y hora del evento debe ser en el futuro');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', location);
      formDataToSend.append('coordinates[lat]', coordinates.lat);
      formDataToSend.append('coordinates[lng]', coordinates.lng);
      formDataToSend.append('date', selectedDate.toISOString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('participation_type', formData.participation_type);
      if (formData.max_participants) {
        formDataToSend.append('max_participants', formData.max_participants);
      }
      if (formData.requirements) {
        formDataToSend.append('requirements', formData.requirements);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await createEvent(formDataToSend);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Limpiar preview anterior
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      setPreview(URL.createObjectURL(file));
      setError(''); // Limpiar errores previos
    } else {
      setFormData(prev => ({
        ...prev,
        image: null
      }));
      setPreview(null);
    }
  };

  // Obtener fecha mínima (hoy)
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Event</h1>
      <p className="text-gray-500 mb-8">Share your idea for a social activity. Fill in the details to invite others to join.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Plan</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Ej: Tapas night in Realejo"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Describe la actividad, qué esperar y requisitos."
                rows={3}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                required
                min={getTodayDate()}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                value={formData.date}
                onChange={handleChange}
              />
              <input
                type="time"
                name="time"
                placeholder="e.g. 18:30"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
            <LocationPicker
              location={location}
              setLocation={setLocation}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">
                Nº máximo de participantes
              </label>
              <input
                type="number"
                name="max_participants"
                id="max_participants"
                placeholder="nº participantes"
                min="1"
                required={formData.participation_type === "participative"}
                disabled={formData.participation_type === "informative"}
                className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition ${
                  formData.participation_type === "informative" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                value={formData.max_participants}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.participation_type === "informative" 
                  ? "Los eventos informativos no permiten participantes"
                  : "Indica el número máximo de personas que pueden apuntarse al plan."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="category"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="mb-4">
                <div className="relative flex items-center mb-1">
                  <label htmlFor="participation_type" className="block text-sm font-medium text-gray-700 mr-1">
                    Tipo de evento
                  </label>
                  <div className="group relative">
                    <span className="ml-1 text-sky-600 cursor-pointer select-none font-bold rounded-full border border-sky-200 w-5 h-5 flex items-center justify-center text-xs">
                      i
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                      <p>
                        <span className="font-semibold">Participativo:</span> los usuarios pueden apuntarse al evento.<br />
                        <span className="font-semibold">Informativo:</span> solo se muestra la información, no se pueden unir participantes.
                      </p>
                    </div>
                  </div>
                </div>
                <select
                  name="participation_type"
                  id="participation_type"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                  value={formData.participation_type}
                  onChange={handleChange}
                >
                  {PARTICIPATION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Imagen de portada</h2>
            <p className="text-xs text-gray-500">
              JPG, PNG. Máximo 5MB.
            </p>
          </div>
          <div className="w-full">
            <input
              type="file"
              name="image"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              onChange={handleImageChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 rounded-xl object-cover w-full max-h-64 border border-gray-200"
              />
            )}
          </div>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg transition disabled:opacity-50"
        >
          {loading ? 'Creating Plan...' : 'Create Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;