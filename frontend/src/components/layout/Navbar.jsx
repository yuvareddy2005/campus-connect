import React, { useContext, useState, useEffect, useRef} from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        Campus Connect
      </NavLink>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/feed">My Feed</NavLink>
            </li>
            <li>
              <NavLink to="/clubs">Clubs</NavLink>
            </li>
            <li>
              <Link to="/events/new" className="create-event-button">
                Create Event
              </Link>
            </li>
            <li className="profile-menu">
              <div className="avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>Profile</NavLink>
                  </li>
                  <li>
                    <NavLink to="/settings" onClick={() => setDropdownOpen(false)}>Settings</NavLink>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <Link to="/register" className="register-button">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;