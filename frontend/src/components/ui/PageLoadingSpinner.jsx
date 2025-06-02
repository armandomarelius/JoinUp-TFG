import { DotLoader } from 'react-spinner-overlay';

const PageLoadingSpinner = ({ 
  loading = true, 
  message = "Cargando...",
  size = 16,
  color = "#0ea5e9"
}) => {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <DotLoader 
          loading={loading}
          size={size}
          color={color}
          between={4}
        />
        <p className="text-sky-500 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default PageLoadingSpinner; 