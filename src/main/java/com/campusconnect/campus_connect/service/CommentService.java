package com.campusconnect.campus_connect.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.campusconnect.campus_connect.dto.CommentDto;
import com.campusconnect.campus_connect.dto.UserDto;
import com.campusconnect.campus_connect.entity.Comment;
import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.entity.User;
import com.campusconnect.campus_connect.repository.CommentRepository;
import com.campusconnect.campus_connect.repository.EventRepository;
import com.campusconnect.campus_connect.repository.UserRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;

    public List<CommentDto> getCommentsByEvent(Long eventId) {
        List<Comment> comments = commentRepository.findByEventIdAndParentCommentIsNull(eventId);
        return comments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CommentDto createComment(Long eventId, String content, Long parentCommentId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User author = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthor(author);
        comment.setEvent(event);

        if (parentCommentId != null) {
            Comment parent = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parent);
        }

        Comment savedComment = commentRepository.save(comment);
        return convertToDto(savedComment);
    }

    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        UserDto authorDto = new UserDto();
        authorDto.setId(comment.getAuthor().getId());
        authorDto.setName(comment.getAuthor().getName());
        dto.setAuthor(authorDto);

        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }

        dto.setReplies(comment.getReplies().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));

        return dto;
    }
}