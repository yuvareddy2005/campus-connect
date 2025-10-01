import React, { useState } from 'react';
import EventService from '../services/EventService';
import AuthService from '../services/AuthService';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  const handleFetchEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      setEvents(response.data);
      setMessage(`Found ${response.data.length} events.`);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setMessage('You must be logged in to see events.');
    }
  };

  return (
    <div>
      <h1>Welcome to Campus Connect</h1>
      <button onClick={handleFetchEvents}>Fetch Events</button>
      <button onClick={() => AuthService.logout()}>Logout</button>
      <p>{message}</p>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;