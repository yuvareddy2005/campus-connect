import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClubService from '../../services/ClubService';
import './Sidebar.css';

const SidebarLeft = () => {
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const response = await ClubService.getAllClubs();
        const joined = response.data.filter(club => club.member);
        setMyClubs(joined.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyClubs();
  }, []);

  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="sidebar-list">
          <li><a href="#" className="sidebar-item"><span>Academic</span> <span className="badge">12</span></a></li>
          <li><a href="#" className="sidebar-item"><span>Social</span> <span className="badge">8</span></a></li>
          <li><a href="#" className="sidebar-item"><span>Sports</span> <span className="badge">5</span></a></li>
          <li><a href="#" className="sidebar-item"><span>Workshops</span> <span className="badge">9</span></a></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Followed Clubs</h3>
        {myClubs.length > 0 ? (
          <ul className="sidebar-list">
            {myClubs.map(club => (
              <li key={club.id}>
                <Link to={`/clubs/${club.id}`} className="sidebar-club-item">
                  <div className="mini-avatar">
                    {club.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{club.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">You haven't joined any clubs yet.</p>
        )}
      </div>
    </aside>
  );
};

export default SidebarLeft;