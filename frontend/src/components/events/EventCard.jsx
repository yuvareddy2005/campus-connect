import React from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  const formatDateBadge = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  const { month, day } = formatDateBadge(event.date);
  const placeholderImage = `https://placehold.co/800x400/121212/00FFFF?text=${encodeURIComponent(event.name)}`;
  return (
    <div className="event-card-v2 glass-card">
      <div className="card-image-container">
        <img 
          src={event.imageUrl || placeholderImage} 
          alt={event.name} 
          className="card-image" 
        />
        <div className="date-badge">
          <span className="date-badge-month">{month}</span>
          <span className="date-badge-day">{day}</span>
        </div>
        <div className="creator-badge">
          <div className="creator-avatar">
            {event.creator?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <span className="creator-name">{event.creator?.name || 'Club Name'}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{event.name}</h3>
        <div className="card-meta">
          <span className="meta-pill">
            <span className="meta-icon">💬</span>
            {event.commentCount} comments
          </span>
          <span className="meta-pill">
            <span className="meta-icon">📍</span>
            {event.location}
          </span>
        </div>
        <p className="card-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;