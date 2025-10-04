import api from './api';

const getCommentsForEvent = (eventId) => {
  return api.get(`/events/${eventId}/comments`);
};

const postComment = (eventId, commentData) => {
  return api.post(`/events/${eventId}/comments`, commentData);
};

const CommentService = {
  getCommentsForEvent,
  postComment,
};

export default CommentService;