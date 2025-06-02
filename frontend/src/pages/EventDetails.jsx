import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getEventById } from "../services/fetchService";
import EventDetailsLayout from "../components/events/EventDetailsLayout";

const EventDetails = () => {
  const { id } = useParams();
  const { data: event, loading, error } = useFetch(getEventById, id);

  if (loading) return <div className="text-center text-sky-600 py-10">Cargando evento...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error.message}</div>;
  if (!event) return null;

  return <EventDetailsLayout event={event} />;
};

export default EventDetails;