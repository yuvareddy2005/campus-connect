package com.campusconnect.campus_connect.controller;

import com.campusconnect.campus_connect.dto.ApiResponse;
import org.springframework.web.multipart.MultipartFile;
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
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok(new ApiResponse<>(true, "Event fetched successfully", event)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(@RequestBody Event event) {
        EventResponseDto createdEvent = eventService.createEvent(event);
        return ResponseEntity.ok(new ApiResponse<>(true, "Event created successfully", createdEvent));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse<EventResponseDto>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        EventResponseDto updatedEvent = eventService.uploadEventImage(id, file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Image uploaded successfully", updatedEvent));
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