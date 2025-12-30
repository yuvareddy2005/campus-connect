package com.campusconnect.campus_connect.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class EventResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDate date;
    private String location;
    private String imageUrl;
    private UserDto creator;
    private int commentCount;
    private int attendeeCount;
    private boolean isCurrentUserRsvpd;
    private List<String> tags;
    private Long clubId;
    private String clubName;
}