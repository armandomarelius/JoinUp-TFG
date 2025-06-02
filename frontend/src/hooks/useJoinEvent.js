import { useState } from 'react';
import { createEventRequest } from '../services/fetchService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useEventRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const sendJoinRequest = async (eventId) => {
    // Resetear estados
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: `/events/${eventId}` } });
        return;
      }

      // Enviar solicitud al backend
      await createEventRequest(eventId);
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  };

  return { sendJoinRequest, loading, error, success };
};
