package com.campusconnect.campus_connect.service;

import com.campusconnect.campus_connect.dto.EventRequestDto;
import com.campusconnect.campus_connect.dto.EventResponseDto;
import com.campusconnect.campus_connect.dto.UserDto;
import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.entity.Tag;
import com.campusconnect.campus_connect.entity.User;
import com.campusconnect.campus_connect.repository.EventRepository;
import com.campusconnect.campus_connect.repository.TagRepository;
import com.campusconnect.campus_connect.repository.UserRepository;
import com.campusconnect.campus_connect.specification.EventSpecification;
import com.campusconnect.campus_connect.repository.ClubRepository;
import com.campusconnect.campus_connect.entity.Club;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ClubRepository clubRepository;

    public Page<EventResponseDto> getAllEvents(Pageable pageable) {
        Page<Event> events = eventRepository.findAll(pageable);
        return events.map(this::convertToDto);
    }

    public Optional<EventResponseDto> getEventById(Long id) {
        return eventRepository.findById(id).map(this::convertToDto);
    }

    public EventResponseDto uploadEventImage(Long eventId, MultipartFile file) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/images/")
                .path(fileName)
                .toUriString();

        event.setImageUrl(fileDownloadUri);
        eventRepository.save(event);

        return convertToDto(event);
    }

    @Transactional
    public EventResponseDto createEvent(EventRequestDto eventRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User creator = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + username));

        Event event = new Event();
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setDate(eventRequest.getDate());
        event.setLocation(eventRequest.getLocation());
        event.setCreator(creator);

        if (eventRequest.getClubId() != null) {
            Club club = clubRepository.findById(eventRequest.getClubId())
                    .orElseThrow(() -> new RuntimeException("Club not found"));
            event.setClub(club);
        }

        if (eventRequest.getTags() != null && !eventRequest.getTags().isEmpty()) {
            Set<Tag> eventTags = new HashSet<>();
            for (String tagName : eventRequest.getTags()) {
                String cleanName = tagName.trim();
                if (!cleanName.isEmpty()) {
                    Tag tag = tagRepository.findByName(cleanName)
                            .orElseGet(() -> tagRepository.save(new Tag(cleanName)));
                    eventTags.add(tag);
                }
            }
            event.setTags(eventTags);
        }

        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }

    @Transactional(readOnly = true)
    public Page<EventResponseDto> getMyFeedEvents(Pageable pageable) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> clubIds = currentUser.getJoinedClubs().stream()
                .map(Club::getId)
                .collect(Collectors.toList());

        if (clubIds.isEmpty()) {
            return Page.empty(pageable);
        }

        Page<Event> events = eventRepository.findByClubIdIn(clubIds, pageable);
        return events.map(this::convertToDto);
    }

    private EventResponseDto convertToDto(Event event) {
        EventResponseDto eventDto = new EventResponseDto();
        eventDto.setId(event.getId());
        eventDto.setName(event.getName());
        eventDto.setDescription(event.getDescription());
        eventDto.setDate(event.getDate());
        eventDto.setLocation(event.getLocation());
        eventDto.setImageUrl(event.getImageUrl());

        UserDto userDto = new UserDto();
        userDto.setId(event.getCreator().getId());
        userDto.setName(event.getCreator().getName());

        eventDto.setCreator(userDto);
        eventDto.setCommentCount(event.getCommentCount());
        eventDto.setAttendeeCount(event.getAttendeeCount());

        if (event.getClub() != null) {
            eventDto.setClubId(event.getClub().getId());
            eventDto.setClubName(event.getClub().getName());
        }

        if (event.getTags() != null) {
            List<String> tagNames = event.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toList());
            eventDto.setTags(tagNames);
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isRsvpd = false;
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User currentUser = userRepository.findByEmail(username).orElse(null);
            if (currentUser != null) {
                isRsvpd = event.getAttendees().stream().anyMatch(user -> user.getId().equals(currentUser.getId()));
            }
        }
        eventDto.setCurrentUserRsvpd(isRsvpd);

        return eventDto;
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setLocation(eventDetails.getLocation());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Page<EventResponseDto> searchEvents(String keyword, String tagName, Pageable pageable) {
        Specification<Event> spec = EventSpecification.findByCriteria(keyword, tagName);
        Page<Event> events = eventRepository.findAll(spec, pageable);
        return events.map(this::convertToDto);
    }

    public Page<EventResponseDto> getEventsByClub(Long clubId, Pageable pageable) {
        Page<Event> events = eventRepository.findByClubId(clubId, pageable);
        return events.map(this::convertToDto);
    }

    @Transactional
    public void rsvpToEvent(Long eventId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.getAttendees().add(user);
        eventRepository.save(event);
    }

    @Transactional
    public void cancelRsvp(Long eventId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.getAttendees().remove(user);
        eventRepository.save(event);
    }
}