package com.campusconnect.campus_connect.controller;

import com.campusconnect.campus_connect.dto.ApiResponse;
import com.campusconnect.campus_connect.dto.ClubRequestDto;
import com.campusconnect.campus_connect.dto.ClubResponseDto;
import com.campusconnect.campus_connect.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClubResponseDto>>> getAllClubs() {
        List<ClubResponseDto> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(new ApiResponse<>(true, "Clubs fetched successfully", clubs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClubResponseDto>> getClubById(@PathVariable Long id) {
        return clubService.getClubById(id)
                .map(club -> ResponseEntity.ok(new ApiResponse<>(true, "Club fetched successfully", club)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClubResponseDto>> createClub(@RequestBody ClubRequestDto clubRequest) {
        ClubResponseDto createdClub = clubService.createClub(clubRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Club created successfully", createdClub));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Void>> joinClub(@PathVariable Long id) {
        clubService.joinClub(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Joined club successfully"));
    }

    @DeleteMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Void>> leaveClub(@PathVariable Long id) {
        clubService.leaveClub(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Left club successfully"));
    }
}