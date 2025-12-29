package com.campusconnect.campus_connect.service;

import com.campusconnect.campus_connect.dto.ClubRequestDto;
import com.campusconnect.campus_connect.dto.ClubResponseDto;
import com.campusconnect.campus_connect.entity.Club;
import com.campusconnect.campus_connect.entity.User;
import com.campusconnect.campus_connect.repository.ClubRepository;
import com.campusconnect.campus_connect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ClubResponseDto> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        return clubs.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ClubResponseDto> getClubById(Long id) {
        return clubRepository.findById(id).map(this::convertToDto);
    }

    @Transactional
    public ClubResponseDto createClub(ClubRequestDto request) {
        Club club = new Club();
        club.setName(request.getName());
        club.setDescription(request.getDescription());

        // Automatically add the creator as a member
        User currentUser = getCurrentUser();
        club.getMembers().add(currentUser);

        Club savedClub = clubRepository.save(club);
        return convertToDto(savedClub);
    }

    @Transactional
    public void joinClub(Long clubId) {
        User user = getCurrentUser();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        club.getMembers().add(user);
        clubRepository.save(club);
    }

    @Transactional
    public void leaveClub(Long clubId) {
        User user = getCurrentUser();
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        club.getMembers().remove(user);
        clubRepository.save(club);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ClubResponseDto convertToDto(Club club) {
        ClubResponseDto dto = new ClubResponseDto();
        dto.setId(club.getId());
        dto.setName(club.getName());
        dto.setDescription(club.getDescription());
        dto.setCreatedDate(club.getCreatedDate());
        dto.setMemberCount(club.getMemberCount());

        try {
            User currentUser = getCurrentUser();
            boolean isMember = false;

            if (club.getMembers() != null) {
                isMember = club.getMembers().stream()
                        .anyMatch(member -> member.getId().equals(currentUser.getId()));
            }
            dto.setMember(isMember);
        } catch (Exception e) {
            dto.setMember(false);
        }

        return dto;
    }
}