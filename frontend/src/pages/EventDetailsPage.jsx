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

  // 1. Reusable function to fetch event details
  const fetchEventDetails = async () => {
    try {
      const eventResponse = await EventService.getEventById(id);
      setEvent(eventResponse.data);
    } catch (err) {
      setError('Failed to load event details.');
      console.error('Fetch Event Error:', err);
    }
  };

  // Reusable function to fetch comments
  const fetchComments = async () => {
    try {
      const commentsResponse = await CommentService.getCommentsForEvent(id);
      setComments(commentsResponse.data);
    } catch (err) {
      setError('Failed to load comments.');
      console.error('Fetch Comments Error:', err);
    }
  };

  // Initial load
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchEventDetails(), fetchComments()]);
      setLoading(false);
    };
    initData();
  }, [id]);

  // 2. Handle RSVP Action
  const handleRsvp = async () => {
    if (!event) return;
    try {
      if (event.currentUserRsvpd) {
        await EventService.cancelRsvp(id);
      } else {
        await EventService.rsvpToEvent(id);
      }
      // Refresh event data to update the button and attendee count
      await fetchEventDetails(); 
    } catch (err) {
      console.error('RSVP failed:', err);
      alert('Failed to update RSVP status. Please try again.');
    }
  };

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
        <div className="details-header">
            <h1 className="details-title">{event.name}</h1>
            {/* 3. RSVP Button Section */}
            <div className="rsvp-section">
                <button 
                    onClick={handleRsvp} 
                    className={`rsvp-button ${event.currentUserRsvpd ? 'leave' : 'join'}`}
                >
                    {event.currentUserRsvpd ? 'Leave Event' : 'Join Event'}
                </button>
            </div>
        </div>

        <p className="details-creator">Hosted by {event.creator?.name || 'Unknown'}</p>
        
        {/* Attendee Count Badge */}
        <div className="attendee-badge">
            <span className="attendee-icon">👥</span>
            <span>{event.attendeeCount} {event.attendeeCount === 1 ? 'person is' : 'people are'} going</span>
        </div>

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