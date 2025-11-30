package com.campusconnect.campus_connect.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private UserDto user; // Add UserDto field

    public AuthResponseDto(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
}