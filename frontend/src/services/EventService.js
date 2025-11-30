import api from './api';

const PAGE_SIZE = 5;

const getAllEvents = (page) => {
  return api.get(`/events?page=${page}&size=${PAGE_SIZE}&sort=date,desc`);
};

const getEventById = (id) => {
  return api.get(`/events/${id}`);
};

const searchEvents = (keyword, page) => {
  return api.get(`/events/search?keyword=${keyword}&page=${page}&size=${PAGE_SIZE}&sort=date,desc`);
};

const createEvent = (eventData) => {
  return api.post('/events', eventData);
};

// --- ADD THESE FUNCTIONS ---
const rsvpToEvent = (eventId) => {
  return api.post(`/events/${eventId}/rsvp`);
};

const cancelRsvp = (eventId) => {
  return api.delete(`/events/${eventId}/rsvp`);
};

const EventService = {
  getAllEvents,
  getEventById,
  searchEvents,
  createEvent,
  rsvpToEvent, // Export these
  cancelRsvp,  // Export these
};

export default EventService;