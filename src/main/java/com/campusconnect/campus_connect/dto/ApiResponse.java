package com.campusconnect.campus_connect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    // Helper constructor for success responses
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // Helper constructor for error responses (no data)
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
        this.timestamp = LocalDateTime.now();
    }
}