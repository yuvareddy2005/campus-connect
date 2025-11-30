package com.campusconnect.campus_connect.controller;

import com.campusconnect.campus_connect.dto.ApiResponse; // Import wrapper
import com.campusconnect.campus_connect.dto.EventResponseDto;
import com.campusconnect.campus_connect.entity.Event;
import com.campusconnect.campus_connect.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EventResponseDto>>> getAllEvents(Pageable pageable) {
        Page<EventResponseDto> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Events fetched successfully", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDto>> getEventById(@PathVariable Long id) {
        // We rely on the service throwing an exception if not found, which
        // GlobalExceptionHandler catches
        // Or we use .orElseThrow in the service.
        // For now, let's assume the service returns Optional, but standard practice
        // with this wrapper
        // is to have the Service throw "ResourceNotFoundException" if missing.
        // Assuming your service returns Optional:
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok(new ApiResponse<>(true, "Event fetched successfully", event)))
                .orElse(ResponseEntity.notFound().build());
        // Note: ideally we'd throw an exception here too to get a JSON 404, but this is
        // fine for now.
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(@RequestBody Event event) {
        EventResponseDto createdEvent = eventService.createEvent(event);
        return ResponseEntity.ok(new ApiResponse<>(true, "Event created successfully", createdEvent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Event updated successfully", updatedEvent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Event deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<EventResponseDto>>> searchEvents(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        Page<EventResponseDto> events = eventService.searchEvents(keyword, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results fetched successfully", events));
    }

    @PostMapping("/{eventId}/rsvp")
    public ResponseEntity<ApiResponse<Void>> rsvpToEvent(@PathVariable Long eventId) {
        eventService.rsvpToEvent(eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, "RSVP successful"));
    }

    @DeleteMapping("/{eventId}/rsvp")
    public ResponseEntity<ApiResponse<Void>> cancelRsvp(@PathVariable Long eventId) {
        eventService.cancelRsvp(eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, "RSVP canceled successfully"));
    }
}