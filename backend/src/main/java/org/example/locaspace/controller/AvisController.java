package org.example.locaspace.controller;

import jakarta.validation.Valid;
import org.example.locaspace.dto.avis.AvisRequest;
import org.example.locaspace.dto.avis.AvisResponse;
import org.example.locaspace.exception.BadRequestException;
import org.example.locaspace.exception.ResourceNotFoundException;
import org.example.locaspace.exception.UnauthorizedException;
import org.example.locaspace.mapper.EntityMapper;
import org.example.locaspace.model.Avis;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.Reservation;
import org.example.locaspace.model.User;
import org.example.locaspace.security.UserDetailsServiceImpl;
import org.example.locaspace.service.AvisService;
import org.example.locaspace.service.LieuService;
import org.example.locaspace.service.ReservationService;
import org.example.locaspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AvisController {

    @Autowired
    private AvisService avisService;

    @Autowired
    private LieuService lieuService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private EntityMapper entityMapper;

    // Get all reviews for a place
    @GetMapping("/lieux/{lieuId}/avis")
    public ResponseEntity<List<AvisResponse>> getAvisForLieu(@PathVariable Long lieuId) {
        Lieu lieu = lieuService.getLieuById(lieuId)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", lieuId));

        List<Avis> avisList = avisService.getAvisForLieu(lieu);
        List<AvisResponse> responses = avisList.stream()
            .map(entityMapper::toAvisResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // Add a review for a place
    @PostMapping("/lieux/{lieuId}/avis")
    @PreAuthorize("hasRole('LOCATAIRE') or hasRole('ADMIN')")
    public ResponseEntity<AvisResponse> addAvis(@PathVariable Long lieuId,
                                               @Valid @RequestBody AvisRequest avisRequest,
                                               Authentication authentication) {

        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        Lieu lieu = lieuService.getLieuById(lieuId)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", lieuId));

        // Check if user has completed reservation for this place
        List<Reservation> completedReservations = reservationService.getPastReservationsForReview(currentUser);
        boolean hasStayedAtPlace = completedReservations.stream()
            .anyMatch(reservation -> reservation.getLieu().getId().equals(lieuId));

        if (!hasStayedAtPlace) {
            throw new BadRequestException("You must have completed a reservation at this place to leave a review");
        }

        // Check if user already reviewed this place
        if (avisService.hasUserReviewedPlace(currentUser, lieu)) {
            throw new BadRequestException("You have already reviewed this place");
        }

        Avis avis = Avis.builder()
            .note(avisRequest.getNote())
            .commentaire(avisRequest.getCommentaire())
            .auteur(currentUser)
            .lieu(lieu)
            .build();

        Avis savedAvis = avisService.createAvis(avis);
        AvisResponse response = entityMapper.toAvisResponse(savedAvis);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get user's own reviews
    @GetMapping("/users/me/avis")
    @PreAuthorize("hasRole('LOCATAIRE') or hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<List<AvisResponse>> getMyAvis(Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        List<Avis> avisList = avisService.getAvisByUser(currentUser);
        List<AvisResponse> responses = avisList.stream()
            .map(entityMapper::toAvisResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // Update a review (only by author)
    @PutMapping("/avis/{avisId}")
    @PreAuthorize("hasRole('LOCATAIRE') or hasRole('ADMIN')")
    public ResponseEntity<AvisResponse> updateAvis(@PathVariable Long avisId,
                                                  @Valid @RequestBody AvisRequest avisRequest,
                                                  Authentication authentication) {

        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        Avis existingAvis = avisService.getAvisById(avisId)
            .orElseThrow(() -> new ResourceNotFoundException("Avis", "id", avisId));

        // Check if user is the author or admin
        if (!existingAvis.getAuteur().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You can only update your own reviews");
        }

        existingAvis.setNote(avisRequest.getNote());
        existingAvis.setCommentaire(avisRequest.getCommentaire());

        Avis updatedAvis = avisService.updateAvis(existingAvis);
        AvisResponse response = entityMapper.toAvisResponse(updatedAvis);

        return ResponseEntity.ok(response);
    }

    // Delete a review (by author or admin)
    @DeleteMapping("/avis/{avisId}")
    @PreAuthorize("hasRole('LOCATAIRE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAvis(@PathVariable Long avisId,
                                          Authentication authentication) {

        UserDetailsServiceImpl.UserPrincipal userPrincipal = 
            (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User currentUser = userService.getUserById(userPrincipal.getId());

        Avis avis = avisService.getAvisById(avisId)
            .orElseThrow(() -> new ResourceNotFoundException("Avis", "id", avisId));

        // Check if user is the author or admin
        if (!avis.getAuteur().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        avisService.deleteAvis(avisId);
        return ResponseEntity.noContent().build();
    }

    // Get place statistics (average rating, review count)
    @GetMapping("/lieux/{lieuId}/stats")
    public ResponseEntity<PlaceStatsResponse> getPlaceStats(@PathVariable Long lieuId) {
        Lieu lieu = lieuService.getLieuById(lieuId)
            .orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", lieuId));

        LieuService.LieuStats stats = lieuService.getLieuStats(lieuId);
        if (stats == null) {
            stats = new LieuService.LieuStats(lieuId, 0.0, 0L);
        }

        PlaceStatsResponse response = new PlaceStatsResponse(
            stats.getLieuId(),
            stats.getAverageRating(),
            stats.getReviewCount()
        );

        return ResponseEntity.ok(response);
    }

    // Response DTO for place statistics
    public static class PlaceStatsResponse {
        private Long lieuId;
        private Double averageRating;
        private Long reviewCount;

        public PlaceStatsResponse(Long lieuId, Double averageRating, Long reviewCount) {
            this.lieuId = lieuId;
            this.averageRating = averageRating;
            this.reviewCount = reviewCount;
        }

        // Getters
        public Long getLieuId() { return lieuId; }
        public Double getAverageRating() { return averageRating; }
        public Long getReviewCount() { return reviewCount; }
    }
}