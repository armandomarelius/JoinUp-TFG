import { MapPin } from 'lucide-react';

const LocationFilter = ({ locationFilter, onLocationChange }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          placeholder="Filtrar por ciudad o ubicación..."
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LocationFilter;
