import { useRef } from "react";
import EventCardHome from "../events/EventCardHome";
import LoadingSpinner from './LoadingSpinner';

const EventCarousel = ({ events, title, loading, error, emptyMessage }) => {
  const carouselRef = useRef(null);

  // Scroll adaptativo según el tamaño de pantalla
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 400;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-4 sm:py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Título responsive */}
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-sky-900 mb-4 sm:mb-6 md:mb-8 text-center px-2">
          {typeof title === 'string' ? title : title}
        </div>
        
        {loading && (
          <LoadingSpinner 
            size={15} 
            message="Cargando eventos..." 
            color="#0ea5e9" 
          />
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-lg mb-4 text-center text-sm sm:text-base mx-2">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base px-4">
            {emptyMessage}
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="relative">
            {/* Botones de navegación */}
            {/* Botón izquierdo */}
            <button
              onClick={scrollLeft}
              className="hidden sm:block absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-1.5 lg:p-2 transition-all duration-200"
            >
              <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Botón derecho */}
            <button
              onClick={scrollRight}
              className="hidden sm:block absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-1.5 lg:p-2 transition-all duration-200"
            >
              <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carrusel*/}
            <div
              ref={carouselRef}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4 sm:px-8 lg:px-16"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {events.map(event => (
                <EventCardHome key={event._id} event={event} />
              ))}
            </div>

            {/* Indicador de scroll en móvil */}
            <div className="sm:hidden text-center mt-2">
              <p className="text-xs text-gray-400">← Desliza para ver más →</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventCarousel;
