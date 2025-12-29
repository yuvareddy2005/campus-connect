import React, { useState, useEffect } from 'react';
import ClubService from '../services/ClubService';
import ClubCard from '../components/clubs/ClubCard';
import { Link } from 'react-router-dom';
import './ClubListPage.css';

const ClubListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await ClubService.getAllClubs();
      setClubs(response.data);
    } catch (err) {
      setError('Failed to load clubs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clubs-container">
      <header className="clubs-header">
        <h1>Explore Clubs</h1>
        <Link to="/clubs/new" className="create-club-btn">
          Start a Club
        </Link>
      </header>

      {loading && <p>Loading clubs...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="clubs-grid">
        {clubs.map((club) => (
          <Link to={`/clubs/${club.id}`} key={club.id} className="club-link">
            <ClubCard club={club} />
          </Link>
        ))}
      </div>
      
      {!loading && clubs.length === 0 && (
        <p className="no-clubs-msg">No clubs found. Be the first to start one!</p>
      )}
    </div>
  );
};

export default ClubListPage;