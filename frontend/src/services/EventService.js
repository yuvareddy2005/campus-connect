import api from './api';

const PAGE_SIZE = 5; 

const getAllEvents = (page) => {
  return api.get(`/events?page=${page}&size=${PAGE_SIZE}&sort=date,desc`);
};

const getEventById = (id) => {
  return api.get(`/events/${id}`);
};

const EventService = {
  getAllEvents,
  getEventById,
};

export default EventService;