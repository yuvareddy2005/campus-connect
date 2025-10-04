package com.campusconnect.campus_connect.dto;

import lombok.Data;

@Data
public class CommentRequestDto {
    private String content;
    private Long parentCommentId; // This can be null
}