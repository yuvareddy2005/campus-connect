import api from './api'; // Import our pre-configured api instance

const getAllEvents = () => {
  return api.get('/events'); // Use the base URL from the api instance
};

const EventService = {
  getAllEvents,
};

export default EventService;