import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventService from '../services/EventService';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import SearchBox from '../components/search/SearchBox';
import SidebarLeft from '../components/layout/SidebarLeft';   // <--- These were likely missing
import SidebarRight from '../components/layout/SidebarRight'; // <--- These were likely missing
import './FeedPage.css';

const FeedPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Filter state: 'all' or 'my-feed'
  const [filter, setFilter] = useState('all'); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tagTerm, setTagTerm] = useState('');

  const fetchEvents = useCallback(async (currentPage, currentSearchTerm, currentTagTerm, currentFilter) => {
    setLoading(true);
    setError('');
    try {
      const isSearching = currentSearchTerm || currentTagTerm;
      
      let response;
      if (isSearching) {
        response = await EventService.searchEvents(currentSearchTerm, currentTagTerm, currentPage);
      } else if (currentFilter === 'my-feed') {
        response = await EventService.getMyFeed(currentPage);
      } else {
        response = await EventService.getAllEvents(currentPage);
      }
      
      setEvents(prevEvents => currentPage === 0 ? response.data.content : [...prevEvents, ...response.data.content]);
      setHasMore(!response.data.last);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      if (currentFilter === 'my-feed' && err.response && err.response.status === 404) {
          setEvents([]);
          setHasMore(false);
      } else {
          setError('Failed to load events.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset and fetch when Search, Tag, or Filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setEvents([]); 
      setPage(0);    
      setHasMore(true);
      fetchEvents(0, searchTerm, tagTerm, filter); 
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, tagTerm, filter, fetchEvents]);

  const loadMoreEvents = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(nextPage, searchTerm, tagTerm, filter);
  };

  return (
    <div className="home-container">
      {/* 3-Column Layout Grid */}
      <div className="feed-layout">
        
        {/* Left Column */}
        <div className="feed-sidebar-left">
           <SidebarLeft />
        </div>

        {/* Center Column (Main Feed) */}
        <main className="feed-main">
          <header className="home-header">
            <h1>{filter === 'all' ? 'Discover Events' : 'My Club Feed'}</h1>
          </header>
          
          <div className="feed-tabs">
            <button 
                className={`feed-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
            >
                All Events
            </button>
            <button 
                className={`feed-tab ${filter === 'my-feed' ? 'active' : ''}`}
                onClick={() => setFilter('my-feed')}
            >
                My Clubs
            </button>
          </div>

          <SearchBox 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            tagTerm={tagTerm}
            setTagTerm={setTagTerm} 
          />

          {error && <p className="error-message">{error}</p>}
          
          {events.length === 0 && !loading && (
             <div className="empty-state">
                <p>No events found.</p>
                {filter === 'my-feed' && (
                    <Link to="/clubs" className="empty-state-link">Browse Clubs to Join</Link>
                )}
             </div>
          )}

          <div className="feed-list">
             {events.map((event) => (
               <Link to={`/events/${event.id}`} key={event.id} className="event-link">
                 <EventCard event={event} />
               </Link>
             ))}
          </div>

          {loading && <p style={{textAlign: 'center'}}>Loading...</p>}
          
          {hasMore && !loading && events.length > 0 && (
            <button onClick={loadMoreEvents} className="load-more-btn">
              Load More
            </button>
          )}
        </main>

        {/* Right Column */}
        <div className="feed-sidebar-right">
           <SidebarRight />
        </div>

      </div>
    </div>
  );
};

export default FeedPage;