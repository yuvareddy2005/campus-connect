import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClubService from '../services/ClubService';
import '../components/auth/AuthForm.css';

const CreateClubPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await ClubService.createClub(formData);

      const newClubId = response.data.id;
      navigate(`/clubs/${newClubId}`);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create club. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="form-title">Start a Club</h2>
        <p className="form-subtitle">Create a community for people who share your passion.</p>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Club Name</label>
            <input 
              type="text" 
              name="name" 
              value={name} 
              onChange={onChange} 
              placeholder="e.g., AI Enthusiasts, Music Society"
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={description} 
              onChange={onChange} 
              placeholder="What is this club about?"
              required 
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Club'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClubPage;