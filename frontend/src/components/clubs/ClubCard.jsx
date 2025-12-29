import React from 'react';
import './ClubCard.css';

const ClubCard = ({ club }) => {
  return (
    <div className="club-card glass-card">
      <div className="club-content">
        <h3 className="club-name">{club.name}</h3>
        <p className="club-description">{club.description}</p>
        
        <div className="club-meta">
          <span className="meta-pill">
            <span className="meta-icon">👥</span>
            {club.memberCount} {club.memberCount === 1 ? 'member' : 'members'}
          </span>
        </div>

        <div className="club-actions">
           <button className={`join-btn-placeholder ${club.member ? 'active' : ''}`}>
              {club.member ? "Joined ✓" : "View Club"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;