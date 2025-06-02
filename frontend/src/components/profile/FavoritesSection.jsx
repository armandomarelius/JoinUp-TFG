import { useFavorites } from '../../context/FavoriteContext';
import EventCard from '../events/EventCard';
import { Heart } from 'lucide-react';

const FavoritesSection = () => {
  const { favorites, loading, error, favoriteCount } = useFavorites();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-sky-500 py-8">Cargando favoritos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-sky-700">Mis Favoritos</h2>
        <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
          {favoriteCount} evento{favoriteCount !== 1 ? 's' : ''}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No tienes eventos favoritos aún</p>
          <p className="text-gray-400 text-sm">¡Explora eventos y marca tus favoritos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <EventCard key={favorite._id} event={favorite.event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection; 