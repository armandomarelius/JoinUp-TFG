import { BeatLoader } from 'react-spinners';

const LoadingSpinner = ({ 
  size = 15, 
  message = 'Cargando...', 
  showMessage = true, 
  className = '',
  color = '#0ea5e9' // sky-500 en hex
}) => {
  const containerSizes = {
    sm: 'py-4',
    md: 'py-8', 
    lg: 'py-12',
    xl: 'py-16'
  };

  // Determinar tamaño del container basado en el size del spinner
  const getContainerSize = () => {
    if (size <= 10) return containerSizes.sm;
    if (size <= 15) return containerSizes.md;
    if (size <= 20) return containerSizes.lg;
    return containerSizes.xl;
  };

  return (
    <div className={`flex flex-col items-center justify-center ${getContainerSize()} ${className}`}>
      {/* BeatLoader de react-spinners */}
      <div className="mb-3">
        <BeatLoader
          color={color}
          size={size}
          margin={2}
          speedMultiplier={1}
        />
      </div>
      
      {/* Mensaje opcional */}
      {showMessage && (
        <p className="text-sky-600 font-medium text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 