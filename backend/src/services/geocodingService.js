import axios from 'axios';

/**
 * Servicio de geocodificación que utiliza OpenStreetMap Nominatim API
 * para convertir direcciones a coordenadas geográficas.
 */
export const geocodeAddress = async (address) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'JoinUp-App'
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                displayName: result.display_name
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error en geocodeAddress:', error);
        throw new Error('Error al geocodificar la dirección');
    }
};

/**
 * Servicio de geocodificación inversa que convierte coordenadas a direcciones.
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat,
                lon: lng,
                format: 'json'
            },
            headers: {
                'User-Agent': 'JoinUp-App'
            }
        });

        if (response.data) {
            return {
                address: response.data.display_name,
                details: response.data.address
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error en reverseGeocode:', error);
        throw new Error('Error al realizar geocodificación inversa');
    }
}; 