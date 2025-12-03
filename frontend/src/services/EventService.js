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

const rsvpToEvent = (eventId) => {
  return api.post(`/events/${eventId}/rsvp`);
};

const cancelRsvp = (eventId) => {
  return api.delete(`/events/${eventId}/rsvp`);
};

const uploadImage = (eventId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/events/${eventId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const EventService = {
  getAllEvents,
  getEventById,
  searchEvents,
  createEvent,
  rsvpToEvent,
  cancelRsvp,
  uploadImage,
};

export default EventService;