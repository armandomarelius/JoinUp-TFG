import { createContext, useState, useEffect, useContext } from 'react';
import { addToFavorites, removeFromFavorites, getUserFavorites } from '../services/fetchService';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Cargar favoritos cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserFavorites();
      // Filtrar favoritos con eventos null
      const validFavorites = data.filter(fav => fav.event !== null);
      setFavorites(validFavorites);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (eventId) => {
    try {
      setError(null);
      await addToFavorites(eventId);
      // Recargar favoritos para obtener los datos actualizados
      await loadFavorites();
      return { success: true, message: 'Evento agregado a favoritos' };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      setError(null);
      await removeFromFavorites(eventId);
      // Quitar el favorito del estado local - con validación
      setFavorites(favorites.filter(fav => fav.event && fav.event._id !== eventId));
      return { success: true, message: 'Evento eliminado de favoritos' };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleFavorite = async (eventId) => {
    if (isFavorite(eventId)) {
      return await removeFavorite(eventId);
    } else {
      return await addFavorite(eventId);
    }
  };

  // Función simple para verificar si un evento es favorito
  const isFavorite = (eventId) => {
    return favorites.some(fav => fav.event && fav.event._id === eventId);
  };

  const value = {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    favoriteCount: favorites.length
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites debe estar dentro del proveedor FavoriteProvider');
  }
  return context;
};

export default FavoriteContext; 