package com.campusconnect.campus_connect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusconnect.campus_connect.dto.ApiResponse; // Import wrapper
import com.campusconnect.campus_connect.dto.CommentDto;
import com.campusconnect.campus_connect.dto.CommentRequestDto;
import com.campusconnect.campus_connect.service.CommentService;

@RestController
@RequestMapping("/api/events/{eventId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentDto>>> getCommentsForEvent(@PathVariable Long eventId) {
        List<CommentDto> comments = commentService.getCommentsByEvent(eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Comments fetched successfully", comments));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentDto>> addCommentToEvent(
            @PathVariable Long eventId,
            @RequestBody CommentRequestDto commentRequest) {

        CommentDto createdComment = commentService.createComment(
                eventId,
                commentRequest.getContent(),
                commentRequest.getParentCommentId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Comment posted successfully", createdComment));
    }
}