import React, { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ eventId, parentCommentId = null, onCommentPosted }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    
    onCommentPosted({ content, parentCommentId });

    setContent('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        className="comment-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentCommentId ? "Write a reply..." : "Add a comment..."}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="comment-submit-btn">Post</button>
    </form>
  );
};

export default CommentForm;