package org.example.locaspace.controller;

import jakarta.validation.Valid;
import org.example.locaspace.dto.lieu.LieuRequest;
import org.example.locaspace.dto.lieu.LieuResponse;
import org.example.locaspace.exception.ResourceNotFoundException;
import org.example.locaspace.exception.UnauthorizedException;
import org.example.locaspace.mapper.EntityMapper;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.User;
import org.example.locaspace.security.UserDetailsServiceImpl;
import org.example.locaspace.service.LieuService;
import org.example.locaspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lieux")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LieuController {
    
    @Autowired
    private LieuService lieuService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EntityMapper entityMapper;

    @Autowired
    private org.example.locaspace.service.PhotoStorageService photoStorageService;

    @Autowired
    private org.example.locaspace.service.CalendarService calendarService;
    
    // Create (Owner)
    @PostMapping
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<LieuResponse> addLieu(@Valid @RequestBody LieuRequest lieuRequest, 
                                               Authentication authentication) {
        
        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());
        
        // Create Lieu entity from DTO
        Lieu lieu = Lieu.builder()
            .titre(lieuRequest.getTitre())
            .description(lieuRequest.getDescription())
            .type(lieuRequest.getType())
            .prix(lieuRequest.getPrix())
            .adresse(lieuRequest.getAdresse())
            .photos(lieuRequest.getPhotos())
            .owner(currentUser)
            .valide(false) // New lieux need admin validation
            .build();
        
        Lieu savedLieu = lieuService.createLieu(lieu);
        LieuResponse response = entityMapper.toLieuResponse(savedLieu);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Read (Public, Owner, Admin)
    @GetMapping
    public ResponseEntity<List<LieuResponse>> listLieux() {
        List<Lieu> lieux = lieuService.getAllValidatedLieux();
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // Calendar: get events in range
    @GetMapping("/properties/{id}/calendar")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<List<org.example.locaspace.model.CalendarEvent>> getCalendar(
            @PathVariable Long id,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        java.time.LocalDate start = java.time.LocalDate.parse(startDate.substring(0, 10));
        java.time.LocalDate end = java.time.LocalDate.parse(endDate.substring(0, 10));
        return ResponseEntity.ok(calendarService.getEvents(id, start, end));
    }

    // Calendar: block dates
    @PostMapping("/properties/{id}/calendar/block")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<org.example.locaspace.model.CalendarEvent> blockDates(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Object> body) {
        java.time.LocalDate start = java.time.LocalDate.parse(body.get("startDate").toString().substring(0, 10));
        java.time.LocalDate end = java.time.LocalDate.parse(body.get("endDate").toString().substring(0, 10));
        String title = body.get("title") != null ? body.get("title").toString() : null;
        return ResponseEntity.ok(calendarService.blockDates(id, start, end, title));
    }

    // Calendar: delete event
    @DeleteMapping("/calendar/events/{eventId}")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        calendarService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    // Upload photos for a lieu
    @PostMapping("/{id}/photos")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<List<String>> uploadPhotos(@PathVariable Long id,
                                                    @RequestParam("photos") List<MultipartFile> photos,
                                                    Authentication authentication) throws java.io.IOException {

        // Verify ownership
        UserDetailsServiceImpl.UserPrincipal userPrincipal =
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        Lieu lieu = lieuService.getLieuById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", id));
        if (!lieu.getOwner().getId().equals(currentUser.getId()) &&
            !"ADMIN".equals(currentUser.getRole())) {
            throw new UnauthorizedException("You don't have permission to upload photos for this lieu");
        }

        List<String> urls = photoStorageService.storePropertyPhotos(id, photos);
        // Merge with existing list
        List<String> merged = new java.util.ArrayList<>();
        if (lieu.getPhotos() != null) merged.addAll(lieu.getPhotos());
        merged.addAll(urls);
        lieu.setPhotos(merged);
        lieuService.createLieu(lieu); // save

        return ResponseEntity.ok(urls);
    }

    // Remove a single photo by URL
    @DeleteMapping("/{id}/photos")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id,
                                           @RequestParam("url") String url,
                                           Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal userPrincipal =
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        Lieu lieu = lieuService.getLieuById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", id));
        if (!lieu.getOwner().getId().equals(currentUser.getId()) &&
            !"ADMIN".equals(currentUser.getRole())) {
            throw new UnauthorizedException("You don't have permission to delete photos for this lieu");
        }

        if (lieu.getPhotos() != null) {
            java.util.List<String> updated = new java.util.ArrayList<>(lieu.getPhotos());
            updated.remove(url);
            lieu.setPhotos(updated);
            lieuService.createLieu(lieu); // save
        }
        return ResponseEntity.noContent().build();
    }

    // Reorder photos
    @PutMapping("/{id}/photos/order")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<Void> reorderPhotos(@PathVariable Long id,
                                             @RequestBody java.util.List<String> orderedUrls,
                                             Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal userPrincipal =
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        Lieu lieu = lieuService.getLieuById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", id));
        if (!lieu.getOwner().getId().equals(currentUser.getId()) &&
            !"ADMIN".equals(currentUser.getRole())) {
            throw new UnauthorizedException("You don't have permission to reorder photos for this lieu");
        }

        lieu.setPhotos(orderedUrls);
        lieuService.createLieu(lieu); // save
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LieuResponse> getLieu(@PathVariable Long id) {
        Lieu lieu = lieuService.getLieuById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", id));
        
        LieuResponse response = entityMapper.toLieuResponse(lieu);
        return ResponseEntity.ok(response);
    }

    // Update (Owner)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<LieuResponse> updateLieu(@PathVariable Long id, 
                                                  @Valid @RequestBody LieuRequest lieuRequest,
                                                  Authentication authentication) {
        
        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());
        
        // Create updated Lieu entity from DTO
        Lieu updatedLieu = Lieu.builder()
            .titre(lieuRequest.getTitre())
            .description(lieuRequest.getDescription())
            .type(lieuRequest.getType())
            .prix(lieuRequest.getPrix())
            .adresse(lieuRequest.getAdresse())
            .photos(lieuRequest.getPhotos())
            .build();
        
        Lieu savedLieu = lieuService.updateLieu(id, updatedLieu, currentUser);
        if (savedLieu == null) {
            throw new UnauthorizedException("You don't have permission to update this lieu");
        }
        
        LieuResponse response = entityMapper.toLieuResponse(savedLieu);
        return ResponseEntity.ok(response);
    }

    // Delete (Owner, Admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLieu(@PathVariable Long id, Authentication authentication) {
        
        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());
        
        boolean deleted = lieuService.deleteLieu(id, currentUser);
        if (!deleted) {
            throw new UnauthorizedException("You don't have permission to delete this lieu");
        }
        
        return ResponseEntity.noContent().build();
    }

    // Admin: Validate Lieu
    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> validateLieu(@PathVariable Long id) {
        boolean validated = lieuService.validateLieu(id);
        if (!validated) {
            throw new ResourceNotFoundException("Lieu", "id", id);
        }
        
        return ResponseEntity.ok("Lieu validated successfully");
    }

    // Filtered search for Lieu
    @GetMapping("/search")
    public ResponseEntity<List<LieuResponse>> searchLieux(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String city) {
        
        List<Lieu> lieux;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            lieux = lieuService.searchLieux(keyword);
        } else if (type != null || minPrice != null || maxPrice != null || city != null) {
            lieux = lieuService.searchLieuxWithFilters(type, minPrice, maxPrice, city);
        } else {
            lieux = lieuService.getAllValidatedLieux();
        }
        
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // Get all lieux by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LieuResponse>> getLieuxByType(@PathVariable String type) {
        List<Lieu> lieux = lieuService.getLieuxByType(type);
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // Get all lieux by city (adresse)
    @GetMapping("/city/{city}")
    public ResponseEntity<List<LieuResponse>> getLieuxByCity(@PathVariable String city) {
        List<Lieu> lieux = lieuService.getLieuxByCity(city);
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // Get all lieux by price range
    @GetMapping("/price")
    public ResponseEntity<List<LieuResponse>> getLieuxByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        
        List<Lieu> lieux = lieuService.getLieuxByPriceRange(min, max);
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // Get all lieux for current owner
    @GetMapping("/my")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<List<LieuResponse>> getMyLieux(Authentication authentication) {
        
        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());
        
        List<Lieu> lieux = lieuService.getLieuxByOwner(currentUser);
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    // Admin: Get unvalidated lieux
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LieuResponse>> getPendingLieux() {
        List<Lieu> lieux = lieuService.getUnvalidatedLieux();
        List<LieuResponse> responses = lieux.stream()
            .map(entityMapper::toLieuResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}
