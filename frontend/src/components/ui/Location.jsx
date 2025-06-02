import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// Para que el icono del marcador se vea bien en React-Leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPicker({ location, setLocation, coordinates, setCoordinates }) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Centra el mapa cuando cambian las coordenadas
  const mapRef = useRef();

  // Buscar dirección en Nominatim
  const handleSearch = async () => {
    if (!search) return;
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocation(display_name);
        // Centrar el mapa
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 15);
        }
      } else {
        setError('No se encontró la dirección');
      }
    } catch {
      setError('Error buscando la dirección');
    }
  };

  // Reverse geocoding cuando se mueve el marcador
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        setLocation(`(${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      }
    } catch {
      setLocation(`(${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    }
  };

  // Permitir mover el marcador
  function DraggableMarker() {
    const [draggable] = useState(true);

    useMapEvents({
      click(e) {
        setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      }
    });

    return (
      <Marker
        position={[coordinates.lat, coordinates.lng]}
        draggable={draggable}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            setCoordinates({ lat: pos.lat, lng: pos.lng });
            reverseGeocode(pos.lat, pos.lng);
          }
        }}
      />
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          placeholder="Escribe una dirección o lugar"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition"
        >
          Buscar
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="mb-2 text-gray-500 text-xs">
        {location && <span>Dirección seleccionada: {location}</span>}
      </div>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ 
          height: '250px', 
          width: '100%', 
          borderRadius: '1rem',
          zIndex: '1'
        }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker />
      </MapContainer>
      <div className="mt-2 text-xs text-gray-400">
        Puedes mover el marcador para afinar la ubicación.
      </div>
    </div>
  );
}

export default LocationPicker;
