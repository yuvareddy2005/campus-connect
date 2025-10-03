import React from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3 className="event-name">{event.name}</h3>
        <span className="event-creator">by {event.creator?.name || 'Unknown'}</span>
      </div>
      <p className="event-description">{event.description}</p>
      <div className="event-card-footer">
        <span className="event-date">{formatDate(event.date)}</span>
        <span className="event-location">{event.location}</span>
      </div>
    </div>
  );
};

export default EventCard;