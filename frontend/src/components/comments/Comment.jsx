import React, { useState } from 'react';
import CommentForm from './CommentForm';
import './Comment.css';

const Comment = ({ comment, onCommentPosted, eventId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  const handleReplySuccess = (newReply) => {
    onCommentPosted(newReply);
    setShowReplyForm(false);
  };

  return (
    <div className="comment-container">
      <div className="comment-header">
        <div className="comment-avatar">
          {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="author-meta">
          <span className="comment-author">{comment.author.name}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
      </div>
      <p className="comment-content">{comment.content}</p>
      <button className="reply-button" onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>

      {showReplyForm && (
        <div className="reply-form-container">
          <CommentForm
            eventId={eventId}
            parentCommentId={comment.id}
            onCommentPosted={handleReplySuccess}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onCommentPosted={onCommentPosted}
              eventId={eventId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;