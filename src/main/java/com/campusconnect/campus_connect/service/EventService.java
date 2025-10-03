package com.campusconnect.campus_connect.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.campusconnect.campus_connect.dto.EventResponseDto;
import com.campusconnect.campus_connect.dto.UserDto;
import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.entity.User;
import com.campusconnect.campus_connect.repository.EventRepository;
import com.campusconnect.campus_connect.repository.UserRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<EventResponseDto> getAllEvents(Pageable pageable) {
        Page<Event> events = eventRepository.findAll(pageable);
        return events.map(this::convertToDto);
    }

    public Optional<EventResponseDto> getEventById(Long id) {
        return eventRepository.findById(id).map(this::convertToDto);
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

        UserDto userDto = new UserDto();
        userDto.setId(event.getCreator().getId());
        userDto.setName(event.getCreator().getName());
        
        eventDto.setCreator(userDto);
        return eventDto;
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setLocation(eventDetails.getLocation());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}