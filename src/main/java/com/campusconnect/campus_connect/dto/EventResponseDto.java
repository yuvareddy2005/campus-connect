package com.campusconnect.campus_connect.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EventResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate date;
    private String location;
    private UserDto creator;
    private int commentCount;
}