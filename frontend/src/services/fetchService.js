const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getAllEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/api/events`, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener los eventos');
        return response.json();
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        throw error;
    }
};

export const getEventById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/events/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener el evento');
        return response.json();
    } catch (error) {
        console.error('Error al obtener el evento:', error);
        throw error;
    }
};

export const getEventsByUser = async () => {
    try {
        const response = await fetch(`${API_URL}/api/events/user`, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener tus eventos');
        return response.json();
    } catch (error) {
        console.error('Error al obtener tus eventos:', error);
        throw error;
    }
};

export const createEventRequest = async (eventId) => {
    try {
        const response = await fetch(`${API_URL}/api/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ eventId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear la solicitud');
        }

        return response.json();
    } catch (error) {
        console.error('Error al crear la solicitud:', error);
        throw error;
    }
};

export const getRequestsReceived = async () => {
    try {
        const response = await fetch(`${API_URL}/api/requests/received`, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener las solicitudes');
        return response.json();
    } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        throw error;
    }
};

export const updateRequestStatus = async (requestId, status) => {
    try {
        const response = await fetch(`${API_URL}/api/requests/${requestId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar la solicitud');
        }

        return response.json();
    } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        throw error;
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        Object.keys(eventData).forEach(key => {
            if (eventData[key] !== null && eventData[key] !== undefined) {
                if (key === 'coordinates') {
                    formData.append('coordinates[lat]', eventData[key].lat);
                    formData.append('coordinates[lng]', eventData[key].lng);
                } else {
                    formData.append(key, eventData[key]);
                }
            }
        });

        const response = await fetch(`${API_URL}/api/events/${eventId}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el evento');
        }

        const result = await response.json();
        return result.event;
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        const response = await fetch(`${API_URL}/api/events/${eventId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar el evento');
        }

        return response.json();
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        throw error;
    }
};

export const getUpcomingEvents = async (limit = 8) => {
    try {
        const response = await fetch(`${API_URL}/api/events/upcoming?limit=${limit}`, { 
            credentials: 'include' 
        });
        if (!response.ok) throw new Error('Error al obtener los eventos próximos');
        return response.json();
    } catch (error) {
        console.error('Error al obtener los eventos próximos:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const formData = new FormData();
        
        // Agregar campos al FormData
        if (profileData.about_me !== undefined) {
            formData.append('about_me', profileData.about_me);
        }
        
        if (profileData.avatar) {
            formData.append('avatar', profileData.avatar);
        }

        const response = await fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el perfil');
        }

        return response.json();
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        throw error;
    }
};

export const getParticipatingEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/api/events/participating`, { 
            credentials: 'include' 
        });
        if (!response.ok) throw new Error('Error al obtener eventos de participación');
        return response.json();
    } catch (error) {
        console.error('Error al obtener eventos de participación:', error);
        throw error;
    }
};

export const leaveEvent = async (eventId) => {
    try {
        const response = await fetch(`${API_URL}/api/events/${eventId}/leave`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al abandonar el evento');
        }

        return response.json();
    } catch (error) {
        console.error('Error al abandonar el evento:', error);
        throw error;
    }
};

export const updateEventStatus = async (eventId, status) => {
    try {
        const response = await fetch(`${API_URL}/api/events/${eventId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el estado del evento');
        }

        return response.json();
    } catch (error) {
        console.error('Error al actualizar el estado del evento:', error);
        throw error;
    }
};

export const removeParticipant = async (eventId, participantId) => {
    try {
        const response = await fetch(`${API_URL}/api/events/${eventId}/remove/${participantId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar el participante');
        }

        return response.json();
    } catch (error) {
        console.error('Error al eliminar el participante:', error);
        throw error;
    }
};

// --- Funciones de administración ---

export const adminGetAllUsers = async () => {
    const response = await fetch(`${API_URL}/api/admin/users`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener los usuarios');
    return response.json();
};

export const adminGetAllEvents = async () => {
    const response = await fetch(`${API_URL}/api/admin/events`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener los eventos');
    return response.json();
};

export const adminDeleteEvent = async (eventId) => {
    const response = await fetch(`${API_URL}/api/admin/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el evento');
    }
    return response.json();
};

export const adminToggleUserStatus = async (userId) => {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/toggle`, {
        method: 'PUT',
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el usuario');
    }
    return response.json();
};

export const getMyRequests = async () => {
    const response = await fetch(`${API_URL}/api/requests/user`, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Error al obtener tus solicitudes');
    return response.json();
};

export const createEvent = async (eventData) => {
    try {
        const response = await fetch(`${API_URL}/api/events`, {
            method: 'POST',
            body: eventData, // FormData
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear el evento');
        }

        return response.json();
    } catch (error) {
        console.error('Error al crear el evento:', error);
        throw error;
    }
};

export const getNearbyEvents = async (lat, lng, distance = 50, limit) => {
    try {
        let url = `${API_URL}/api/events/nearby?lat=${lat}&lng=${lng}&distance=${distance}`;
        
        // Agregar parámetro limit si se proporciona
        if (limit) {
            url += `&limit=${limit}`;
        }
        
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener eventos cercanos');
        return response.json();
    } catch (error) {
        console.error('Error al obtener eventos cercanos:', error);
        throw error;
    }
};

// --- Funciones de favoritos ---
export const addToFavorites = async (eventId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ eventId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al agregar a favoritos');
        }

        return response.json();
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        throw error;
    }
};

export const removeFromFavorites = async (eventId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites/${eventId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al quitar de favoritos');
        }

        return response.json();
    } catch (error) {
        console.error('Error al quitar de favoritos:', error);
        throw error;
    }
};

export const getUserFavorites = async () => {
    try {
        const response = await fetch(`${API_URL}/api/favorites`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al obtener favoritos');
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        throw error;
    }
};
