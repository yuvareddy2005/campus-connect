package com.campusconnect.campus_connect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campusconnect.campus_connect.dto.EventResponseDto;
import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public Page<EventResponseDto> getAllEvents(Pageable pageable) {
        return eventService.getAllEvents(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new event
    @PostMapping
    public EventResponseDto createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    // Update an existing event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        try {
            Event updatedEvent = eventService.updateEvent(id, eventDetails);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public Page<EventResponseDto> searchEvents(
            @RequestParam(required = false) String keyword, 
            Pageable pageable) {
        return eventService.searchEvents(keyword, pageable);
    }

    @PostMapping("/{eventId}/rsvp")
    public ResponseEntity<Void> rsvpToEvent(@PathVariable Long eventId) {
        eventService.rsvpToEvent(eventId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{eventId}/rsvp")
    public ResponseEntity<Void> cancelRsvp(@PathVariable Long eventId) {
        eventService.cancelRsvp(eventId);
        return ResponseEntity.noContent().build();
    }
}