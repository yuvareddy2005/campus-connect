import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventService from '../../services/EventService';
import './EventForm.css';

const EventForm = () => {
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const { name, description, date, location } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      const response = await EventService.createEvent(formData);
      const newEventId = response.data.id;

      if (file) {
        await EventService.uploadImage(newEventId, file);
      }

      navigate(`/events/${newEventId}`);
      
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create a New Event</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
  
        <div className="form-group">
          <label>Event Poster (Optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onFileChange} 
            className="file-input"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={description} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={date} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={location} onChange={onChange} required />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" disabled={uploading}>
          {uploading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;