import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventService from '../services/EventService';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams(); // Get the 'id' from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await EventService.getEventById(id);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]); // Re-run the effect if the id changes

  if (loading) return <div>Loading event...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div>Event not found.</div>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="details-container">
      <Link to="/" className="back-link">&larr; Back to Feed</Link>
      <div className="details-card">
        <h1 className="details-title">{event.name}</h1>
        <p className="details-description">{event.description}</p>
        <div className="details-footer">
          <span><strong>Date:</strong> {formatDate(event.date)}</span>
          <span><strong>Location:</strong> {event.location}</span>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;