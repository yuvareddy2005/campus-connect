import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">
          Connect, Discover, & <span className="highlight">Experience</span> Campus Life.
        </h1>
        <p className="landing-subtitle">
          The ultimate social platform for students. Find events, join clubs, and make unforgettable memories. Your campus is waiting.
        </p>
        <Link to="/register" className="cta-button">
          Get Started for Free
        </Link>
      </div>
    </div>

    <section className="features-section">
        <h2 className="section-title">An Unforgettable Year Awaits</h2>
        <p className="section-subtitle">Everything you need to make the most of your time on campus.</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Discover Events</h3>
            <p>From hackathons to movie nights, never miss out on what's happening. Our dynamic feed keeps you in the loop.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Search</h3>
            <p>Find exactly what you're looking for in seconds. Filter events by keyword, date, or location to perfectly tailor your search.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Join the Conversation</h3>
            <p>Every event has a discussion board. Ask questions, coordinate with friends, and share your experience by leaving comments.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;