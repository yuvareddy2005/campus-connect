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
  
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
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

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(',', '');
      
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      const eventPayload = {
        ...formData,
        tags: tags
      };

      const response = await EventService.createEvent(eventPayload);
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
          <label>Tags (Press Enter to add)</label>
          <div className="tag-input-container">
            <div className="tag-list">
              {tags.map((tag, index) => (
                <span key={index} className="tag-pill-form">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="tag-remove-btn">×</button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "e.g. Tech, Music, Workshop" : ""}
              className="tag-input-field"
            />
          </div>
        </div>

        <div className="form-group">
          <label style={{ marginBottom: '10px', display: 'block' }}>Event Poster (Optional)</label>
          <input 
            type="file" 
            id="file-upload" 
            accept="image/*" 
            onChange={onFileChange} 
            className="file-input-hidden"
          />
          <label htmlFor="file-upload" className="file-upload-btn">
            Choose Image
          </label>
          <span className="file-name-text">
            {file ? file.name : "No file chosen"}
          </span>
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