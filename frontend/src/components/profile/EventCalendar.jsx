import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getParticipatingEvents, getEventsByUser } from "../../services/fetchService";
import { useFavorites } from "../../context/FavoriteContext";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventCalendar = () => {
  const { data: participatingEvents } = useFetch(getParticipatingEvents);
  const { data: myEvents } = useFetch(getEventsByUser);
  const { favorites } = useFavorites();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener eventos del mes actual
  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const currentTime = new Date();
    
    const participating = participatingEvents?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && 
             eventDate.getMonth() === month &&
             eventDate > currentTime;
    }) || [];
    
    const created = myEvents?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && 
             eventDate.getMonth() === month &&
             eventDate > currentTime;
    }) || [];

    const favoriteEvents = favorites?.filter(favorite => {
      const eventDate = new Date(favorite.event.date);
      return eventDate.getFullYear() === year && 
             eventDate.getMonth() === month &&
             eventDate > currentTime;
    }).map(favorite => favorite.event) || [];
    
    return {
      participating,
      created,
      favorites: favoriteEvents
    };
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const eventsThisMonth = getEventsForMonth();
    
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = day.getMonth() === month;
      const isToday = day.toDateString() === new Date().toDateString();
      
      // Buscar eventos en este día
      const participatingEvents = eventsThisMonth.participating.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === day.toDateString();
      });
      
      const createdEvents = eventsThisMonth.created.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === day.toDateString();
      });

      const favoriteEvents = eventsThisMonth.favorites.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === day.toDateString();
      });
      
      days.push({
        date: day,
        dayNumber: day.getDate(),
        isCurrentMonth,
        isToday,
        participatingEvents,
        createdEvents,
        favoriteEvents
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Función para determinar el estilo del día
  const getDayStyle = (day) => {
    const hasParticipating = day.participatingEvents.length > 0;
    const hasCreated = day.createdEvents.length > 0;
    const hasFavorites = day.favoriteEvents.length > 0;
    
    let baseClasses = `
      relative h-12 flex items-center justify-center text-sm rounded-lg cursor-pointer
      transition-colors
    `;
    
    if (!day.isCurrentMonth) {
      return baseClasses + ' text-gray-300';
    }
    
    if (day.isToday) {
      baseClasses += ' ring-2 ring-sky-400 font-bold';
    }
    
    if (hasCreated) {
      return baseClasses + ' bg-green-500 text-white hover:bg-green-600';
    } else if (hasParticipating) {
      return baseClasses + ' bg-sky-500 text-white hover:bg-sky-600';
    } else if (hasFavorites) {
      return baseClasses + ' bg-pink-500 text-white hover:bg-pink-600';
    } else {
      return baseClasses + ' text-gray-700 hover:bg-gray-50';
    }
  };

  // Función para generar el tooltip
  const getTooltip = (day) => {
    const parts = [];
    
    if (day.createdEvents.length > 0) {
      parts.push(`${day.createdEvents.length} evento${day.createdEvents.length > 1 ? 's' : ''} creado${day.createdEvents.length > 1 ? 's' : ''}: ${day.createdEvents.map(e => e.title).join(', ')}`);
    }
    
    if (day.participatingEvents.length > 0) {
      parts.push(`${day.participatingEvents.length} evento${day.participatingEvents.length > 1 ? 's' : ''} participando: ${day.participatingEvents.map(e => e.title).join(', ')}`);
    }

    if (day.favoriteEvents.length > 0) {
      parts.push(`${day.favoriteEvents.length} evento${day.favoriteEvents.length > 1 ? 's' : ''} favorito${day.favoriteEvents.length > 1 ? 's' : ''}: ${day.favoriteEvents.map(e => e.title).join(', ')}`);
    }
    
    return parts.join(' | ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-sky-600" />
        </button>
        
        <h3 className="text-xl font-bold text-sky-700">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-sky-600" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={getDayStyle(day)}
            title={getTooltip(day)}
          >
            {day.dayNumber}
            
            {(day.participatingEvents.length > 0 || day.createdEvents.length > 0 || day.favoriteEvents.length > 0) && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                {day.createdEvents.length > 0 && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
                {day.participatingEvents.length > 0 && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
                {day.favoriteEvents.length > 0 && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Eventos creados</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-sky-500 rounded"></div>
          <span>Participando</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-pink-500 rounded"></div>
          <span>Favoritos</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-sky-100 rounded ring-2 ring-sky-400"></div>
          <span>Hoy</span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar; 