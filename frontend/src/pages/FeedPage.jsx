import React, { useState, useEffect, useContext, useRef, useCallback} from 'react';
import EventService from '../services/EventService';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import { Link } from 'react-router-dom';
import SearchBox from '../components/search/SearchBox';
import './FeedPage.css';

const FeedPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialLoad = useRef(true);

  const fetchEvents = useCallback(async (currentPage, currentSearchTerm) => {
    setLoading(true);
    setError('');
    try {
      const response = currentSearchTerm
        ? await EventService.searchEvents(currentSearchTerm, currentPage)
        : await EventService.getAllEvents(currentPage);
      
      setEvents(prevEvents => currentPage === 0 ? response.data.content : [...prevEvents, ...response.data.content]);
      setHasMore(!response.data.last);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setEvents([]); 
      setPage(0);    
      setHasMore(true);
      fetchEvents(0, searchTerm);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchEvents]);

  const loadMoreEvents = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Event Feed</h1>
      </header>
      
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="feed-container">
        {error && <p className="error-message">{error}</p>}
        {events.map((event) => (
          <Link to={`/events/${event.id}`} key={event.id} className="event-link">
            <EventCard event={event} />
          </Link>
        ))}

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

export default FeedPage;