import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClubService from '../../services/ClubService';
import './Sidebar.css';

const SidebarRight = () => {
  const [trendingClubs, setTrendingClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await ClubService.getAllClubs();
        setTrendingClubs(response.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchClubs();
  }, []);

  return (
    <aside className="sidebar sidebar-right">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Your Upcoming Events</h3>
        <div className="mini-event-card">
            <h4 className="mini-event-title">Spring Hackathon</h4>
            <p className="mini-event-meta">Apr 12 - CS Building</p>
        </div>
        <div className="mini-event-card">
            <h4 className="mini-event-title">Campus Charity Run</h4>
            <p className="mini-event-meta">Nov 15 - Main Gate</p>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Trending Clubs</h3>
        <ul className="sidebar-list">
            {trendingClubs.map(club => (
              <li key={club.id}>
                <Link to={`/clubs/${club.id}`} className="sidebar-club-item">
                  <div className="mini-avatar">{club.name.charAt(0).toUpperCase()}</div>
                  <span>{club.name}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarRight;