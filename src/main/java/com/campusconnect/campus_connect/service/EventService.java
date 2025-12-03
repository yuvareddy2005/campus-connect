package com.campusconnect.campus_connect.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campusconnect.campus_connect.dto.EventResponseDto;
import com.campusconnect.campus_connect.dto.UserDto;
import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.entity.User;
import com.campusconnect.campus_connect.repository.EventRepository;
import com.campusconnect.campus_connect.repository.UserRepository;
import com.campusconnect.campus_connect.specification.EventSpecification;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

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

        // Store the file and get the filename
        String fileName = fileStorageService.storeFile(file);

        // Generate the download URI (this assumes we will create a controller to serve
        // images at /api/images/{fileName})
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/images/")
                .path(fileName)
                .toUriString();

        // Save the full URI or just the filename. Saving the URI is easier for the
        // frontend.
        event.setImageUrl(fileDownloadUri);
        eventRepository.save(event);

        return convertToDto(event);
    }

    public EventResponseDto createEvent(Event event) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User creator = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + username));

        event.setCreator(creator);
        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
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

    public Page<EventResponseDto> searchEvents(String keyword, Pageable pageable) {
        Specification<Event> spec = EventSpecification.findByCriteria(keyword);
        Page<Event> events = eventRepository.findAll(spec, pageable);
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