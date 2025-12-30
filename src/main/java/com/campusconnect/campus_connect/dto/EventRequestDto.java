package com.campusconnect.campus_connect.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class EventRequestDto {
    private String name;
    private String description;
    private LocalDate date;
    private String location;
    private List<String> tags;
    private Long clubId;
}