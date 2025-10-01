import React, { useState, useEffect, useContext } from 'react';
import EventService from '../services/EventService';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import './HomePage.css'; // We will create this file next

const HomePage = () => {
  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  // Use useEffect to fetch events when the component loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await EventService.getAllEvents();
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. You may need to log in again.');
      }
    };

    fetchEvents();
  }, []); // The empty array [] means this effect runs only once on mount

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Event Feed</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || 'Guest'}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      
      <main className="feed-container">
        {error && <p className="error-message">{error}</p>}
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          !error && <p>No events found. Why not create one?</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;