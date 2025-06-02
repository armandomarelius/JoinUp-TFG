import { createContext, useContext, useState, useEffect } from 'react';
import { getRequestsReceived } from '../services/fetchService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchPendingRequests = async () => {
    if (!isAuthenticated) {
      setPendingRequestsCount(0);
      return;
    }

    setLoading(true);
    try {
      const requests = await getRequestsReceived();
      const pendingCount = requests.filter(request => request.status === 'pending').length;
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      setPendingRequestsCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar manualmente (útil después de aceptar/rechazar solicitudes)
  const refreshNotifications = () => {
    fetchPendingRequests();
  };

  useEffect(() => {
    fetchPendingRequests();
    
    // Actualizar cada 2 minutos cuando el usuario está autenticado
    if (isAuthenticated) {
      const interval = setInterval(fetchPendingRequests, 120000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    pendingRequestsCount,
    loading,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error('useNotifications debe usarse dentro de NotificationProvider');
    }
    return context;
  };