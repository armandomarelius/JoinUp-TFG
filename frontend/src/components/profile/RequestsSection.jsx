import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useNotifications } from "../../context/NotificationContext";
import { getRequestsReceived, updateRequestStatus } from "../../services/fetchService";
import UserAvatar from "../ui/UserAvatar";

const RequestsSection = () => {
  const { data: requests, loading, error } = useFetch(getRequestsReceived);
  const { refreshNotifications } = useNotifications();
  const [updateError, setUpdateError] = useState(null);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);
  const [localRequests, setLocalRequests] = useState([]);

  // Actualizar requests locales cuando cambien los datos del fetch
  useEffect(() => {
    if (requests) {
      setLocalRequests(requests);
    }
  }, [requests]);

  const handleStatusChange = async (requestId, status) => {
    setUpdatingRequestId(requestId);
    setUpdateError(null);

    try {
      await updateRequestStatus(requestId, status);

      // Actualizar el estado local
      setLocalRequests(currentRequests =>
        currentRequests.map(request =>
          request._id === requestId
            ? { ...request, status }
            : request
        )
      );
      
      // Actualizar las notificaciones
      refreshNotifications();
    } catch (updateError) {
      setUpdateError(updateError.message);
    } finally {
      setUpdatingRequestId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-sky-700">Solicitudes Recibidas</h2>

      {loading && <div className="text-center text-sky-500 py-8">Cargando solicitudes...</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error.message}</div>}
      {updateError && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{updateError}</div>}

      <div className="space-y-4">
        {localRequests?.length === 0 && !loading && (
          <div className="text-gray-500 text-center py-8">No tienes solicitudes pendientes en tus eventos.</div>
        )}
        {localRequests?.map(request => (
          <div key={request._id} className="bg-gray-50 rounded-xl flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border border-sky-100">
            <div className="flex items-center gap-4">
              <UserAvatar user={request.user} size="md" />
              <div>
                <div className="font-semibold text-gray-900">{request.user?.username || 'Usuario'}</div>
                <div className="text-sm text-gray-500">Evento: <span className="font-medium text-sky-700">{request.event?.title}</span></div>
                <div className="text-xs text-gray-400 mt-1">Estado: <span className="font-semibold text-sky-600">{request.status}</span></div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => handleStatusChange(request._id, "accepted")}
                disabled={request.status !== "pending" || updatingRequestId === request._id}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${request.status !== "pending" || updatingRequestId === request._id
                    ? "bg-sky-300 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-700"
                  }`}
              >
                {updatingRequestId === request._id ? "..." : "Aceptar"}
              </button>
              <button
                onClick={() => handleStatusChange(request._id, "rejected")}
                disabled={request.status !== "pending" || updatingRequestId === request._id}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${request.status !== "pending" || updatingRequestId === request._id
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
              >
                {updatingRequestId === request._id ? "..." : "Rechazar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsSection; 