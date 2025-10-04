import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments, onCommentPosted, eventId }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onCommentPosted={onCommentPosted}
          eventId={eventId}
        />
      ))}
    </div>
  );
};

export default CommentList;