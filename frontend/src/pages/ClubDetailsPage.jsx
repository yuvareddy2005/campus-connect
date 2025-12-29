import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ClubService from '../services/ClubService';
import './ClubDetailsPage.css';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClubDetails = async () => {
    try {
      const response = await ClubService.getClubById(id);
      setClub(response.data);
    } catch (err) {
      setError('Failed to load club details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const handleJoinToggle = async () => {
    try {
      if (club.member) {
        await ClubService.leaveClub(id);
      } else {
        await ClubService.joinClub(id);
      }
      await fetchClubDetails(); 
    } catch (err) {
      console.error('Failed to update membership:', err);
      alert('Action failed. Please try again.');
    }
  };

  if (loading) return <div className="loading-text">Loading club...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!club) return <div className="error-message">Club not found.</div>;

  return (
    <div className="club-details-container">
      <Link to="/clubs" className="back-link">&larr; Back to Clubs</Link>
      
      <div className="club-hero glass-card">
        <div className="club-header-content">
            <h1 className="club-title">{club.name}</h1>
            <div className="member-badge">
                <span className="meta-icon">👥</span>
                {club.memberCount} {club.memberCount === 1 ? 'member' : 'members'}
            </div>
        </div>
        
        <button 
            onClick={handleJoinToggle}
            className={`join-club-btn ${club.member ? 'leave' : 'join'}`}
        >
            {club.member ? 'Leave Club' : 'Join Club'}
        </button>
      </div>

      <div className="club-info-section glass-card">
        <h2>About Us</h2>
        <p className="club-full-description">{club.description}</p>
        <p className="club-founded">Established: {new Date(club.createdDate).toLocaleDateString()}</p>
      </div>

      {/* Placeholder for Club Events (Week 18 feature) */}
      <div className="club-events-section">
        <h2>Upcoming Events</h2>
        <p style={{ color: '#888', fontStyle: 'italic' }}>No events scheduled yet.</p>
      </div>
    </div>
  );
};

export default ClubDetailsPage;