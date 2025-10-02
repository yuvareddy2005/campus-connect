import React, { useState, useEffect, useContext, useRef} from 'react';
import EventService from '../services/EventService';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const initialLoad = useRef(true);

  const fetchEvents = async (currentPage) => {
    setLoading(true);
    setError('');
    try {
      const response = await EventService.getAllEvents(currentPage);
      // Append new events to the existing list
      setEvents(prevEvents => [...prevEvents, ...response.data.content]);
      // Update hasMore based on whether this is the last page
      setHasMore(!response.data.last);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. You may need to log in again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad.current) {
      setEvents([]); // Clear events on initial load to prevent duplication on re-login
      setPage(0);
      setHasMore(true);
      fetchEvents(0);
      initialLoad.current = false; // Flip the flag to false
    }
  }, []);// The empty array [] means this effect runs only once on mount

  const loadMoreEvents = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

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
        {events.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id} className="event-link">
            <EventCard event={event} />
          </Link>
        ))}

        {/* --- "Load More" Button --- */}
        {loading && <p>Loading...</p>}
        {hasMore && !loading && (
          <button onClick={loadMoreEvents} className="load-more-btn">
            Load More
          </button>
        )}
      </main>
    </div>
  );
};

export default HomePage;