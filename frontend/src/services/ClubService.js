import api from './api';

const getAllClubs = () => {
  return api.get('/clubs');
};

const getClubById = (id) => {
  return api.get(`/clubs/${id}`);
};

const createClub = (clubData) => {
  return api.post('/clubs', clubData);
};

const joinClub = (id) => {
  return api.post(`/clubs/${id}/join`);
};

const leaveClub = (id) => {
  return api.delete(`/clubs/${id}/join`);
};

const ClubService = {
  getAllClubs,
  getClubById,
  createClub,
  joinClub,
  leaveClub,
};

export default ClubService;