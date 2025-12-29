package com.campusconnect.campus_connect.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClubResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdDate;
    private int memberCount;
    private boolean isMember;
}