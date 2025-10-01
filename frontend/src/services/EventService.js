import api from './api';

const getAllEvents = () => {
  return api.get('/events');
};

const getEventById = (id) => {
  return api.get(`/events/${id}`);
};

const EventService = {
  getAllEvents,
  getEventById,
};

export default EventService;