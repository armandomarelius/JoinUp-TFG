import EventCard from './EventCard';

const EventList = ({ events }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {events.map(event => (
      <EventCard key={event._id} event={event} />
    ))}
  </div>
);

export default EventList;
