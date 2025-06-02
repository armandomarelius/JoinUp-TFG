/**
 * Formatea una fecha para usar en inputs datetime-local
 * @param {string} dateString - Fecha en formato ISO o string
 * @returns {string} Fecha en formato YYYY-MM-DDTHH:MM
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Formatea una fecha para mostrar al usuario
 * @param {string} dateString - Fecha en formato ISO o string
 * @returns {string} Fecha formateada en español
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha con hora para mostrar al usuario
 * @param {string} dateString - Fecha en formato ISO o string
 * @returns {string} Fecha y hora formateada en español
 */
export const formatDateTimeForDisplay = (dateString) => {
  if (!dateString) return "";
  
  return new Date(dateString).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}; 