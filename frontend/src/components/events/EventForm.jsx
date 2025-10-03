import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventService from '../../services/EventService';
import './EventForm.css';

const EventForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });
  const [error, setError] = useState('');

  const { name, description, date, location } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await EventService.createEvent(formData);
      navigate(`/events/${response.data.id}`);
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error(err);
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
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;