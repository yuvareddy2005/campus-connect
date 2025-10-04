package com.campusconnect.campus_connect.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private UserDto author;
    private Long parentCommentId;
    private List<CommentDto> replies;
}