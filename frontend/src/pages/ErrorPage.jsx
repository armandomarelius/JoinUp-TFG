import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-sky-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">
          Página no encontrada
        </h2>
        <p className="text-gray-600 max-w-md">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
