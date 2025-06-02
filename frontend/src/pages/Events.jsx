import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getAllEvents } from '../services/fetchService';
import EventList from '../components/events/EventList';
import CategoryFilter from '../components/events/CategoryFilter';
import SearchBar from '../components/events/SearchBar';
import LocationFilter from '../components/events/LocationFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Events = () => {
  const { data: events, loading, error } = useFetch(getAllEvents, []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Filtrar eventos por categoría, búsqueda y ubicación
  const filteredEvents = events?.filter(event => {
    // Primero filtrar por categoría
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Filtrar por término de búsqueda en el título
    const matchesSearch = searchTerm === '' || 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por ubicación (ciudad o cualquier parte de la location)
    const matchesLocation = locationFilter === '' || 
      event.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesLocation;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">Todos los Eventos</h1>
      
      {/* Contenedor de filtros */}
      <div className="mb-6 space-y-4">
        {/* Buscadores en la misma fila */}
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <LocationFilter 
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
          />
        </div>
        
        {/* Filtro de categorías */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      {loading && (
        <LoadingSpinner 
          size={18} 
          message="Cargando eventos..." 
          color="#0ea5e9"
        />
      )}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && filteredEvents.length === 0 && selectedCategory === 'all' && searchTerm === '' && locationFilter === '' && (
        <div className="text-center text-gray-500">No hay eventos disponibles.</div>
      )}
      {!loading && !error && filteredEvents.length === 0 && (selectedCategory !== 'all' || searchTerm !== '' || locationFilter !== '') && (
        <div className="text-center text-gray-500">
          No se encontraron eventos que coincidan con los filtros aplicados.
        </div>
      )}
      {!loading && !error && filteredEvents.length > 0 && (
        <EventList events={filteredEvents} />
      )}
    </div>
  );
};

export default Events;