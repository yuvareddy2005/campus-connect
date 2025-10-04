import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventService from '../services/EventService';
import CommentService from '../services/CommentService';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const commentsResponse = await CommentService.getCommentsForEvent(id);
      setComments(commentsResponse.data);
    } catch (err) {
      setError('Failed to load comments.');
      console.error('Fetch Comments Error:', err);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const eventResponse = await EventService.getEventById(id);
        setEvent(eventResponse.data);
        await fetchComments();
      } catch (err) {
        setError('Failed to load event details.');
        console.error('Fetch Event Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handlePostComment = async (commentData) => {
    try {
      await CommentService.postComment(id, commentData);
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError('Failed to post comment. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="details-container">
      <Link to="/feed" className="back-link">&larr; Back to Feed</Link>
      
      <div className="details-card">
        <h1 className="details-title">{event.name}</h1>
        <p className="details-creator">Hosted by {event.creator?.name || 'Unknown'}</p>
        <p className="details-description">{event.description}</p>
        <div className="details-footer">
          <span><strong>Date:</strong> {formatDate(event.date)}</span>
          <span><strong>Location:</strong> {event.location}</span>
        </div>
      </div>

      <div className="comments-section">
        <h3>Join the Conversation</h3>
        <CommentForm eventId={id} onCommentPosted={handlePostComment} />
        <CommentList 
          comments={comments} 
          onCommentPosted={handlePostComment} 
          eventId={id} 
        />
      </div>
    </div>
  );
};

export default EventDetailsPage;