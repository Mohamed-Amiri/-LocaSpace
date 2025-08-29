package org.example.locaspace.controller;

import org.example.locaspace.dto.reservation.ReservationResponse;
import org.example.locaspace.dto.lieu.LieuResponse;
import org.example.locaspace.dto.user.UserSummaryResponse;
import org.example.locaspace.exception.ResourceNotFoundException;
import org.example.locaspace.mapper.EntityMapper;
import org.example.locaspace.model.Reservation;
import org.example.locaspace.model.User;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.security.UserDetailsServiceImpl;
import org.example.locaspace.service.ReservationService;
import org.example.locaspace.service.LieuService;
import org.example.locaspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReservationController {

    @Autowired private ReservationService reservationService;
    @Autowired private UserService userService;
    @Autowired private LieuService lieuService;
    @Autowired private EntityMapper entityMapper;

    // Owner: Get reservations for their spaces
    @GetMapping("/owner")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getReservationsForOwner(Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal principal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User owner = userService.getUserById(principal.getId());
        List<Reservation> reservations = reservationService.getReservationsByOwner(owner);
        List<ReservationResponse> responses = reservations.stream().map(entityMapper::toReservationResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Tenant: Get own reservations
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal principal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User tenant = userService.getUserById(principal.getId());
        List<Reservation> reservations = reservationService.getReservationsByTenant(tenant);
        List<ReservationResponse> responses = reservations.stream().map(entityMapper::toReservationResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Tenant: Create reservation
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody java.util.Map<String, Object> body,
                                                                 Authentication authentication) {
        User tenant = null;
        try {
            UserDetailsServiceImpl.UserPrincipal principal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
            System.out.println("Principal ID: " + principal.getId());
            
            tenant = userService.getUserById(principal.getId());
            if (tenant == null) {
                System.err.println("User not found with ID: " + principal.getId());
                return ResponseEntity.status(401).build();
            }

            System.out.println("Creating reservation for user: " + tenant.getId() + " (" + tenant.getNom() + ")");
            System.out.println("Request body: " + body);

            Object placeIdObj = body.get("placeId");
            Object startObj = body.get("startDate");
            Object endObj = body.get("endDate");

            if (placeIdObj == null || startObj == null || endObj == null) {
                System.out.println("Missing required fields. PlaceId: " + placeIdObj + ", StartDate: " + startObj + ", EndDate: " + endObj);
                return ResponseEntity.badRequest().build();
            }

            Long lieuId;
            try {
                lieuId = Long.valueOf(placeIdObj.toString());
                System.out.println("Parsed lieuId: " + lieuId);
            } catch (NumberFormatException e) {
                System.err.println("Invalid placeId format: " + placeIdObj);
                return ResponseEntity.badRequest().build();
            }
            
            String startStr = startObj.toString();
            String endStr = endObj.toString();
            
            System.out.println("Parsing dates - Start: " + startStr + ", End: " + endStr);
            
            java.time.LocalDate start;
            java.time.LocalDate end;
            
            try {
                // Handle different date formats
                if (startStr.length() >= 10) {
                    start = java.time.LocalDate.parse(startStr.substring(0, 10));
                } else {
                    start = java.time.LocalDate.parse(startStr);
                }
                
                if (endStr.length() >= 10) {
                    end = java.time.LocalDate.parse(endStr.substring(0, 10));
                } else {
                    end = java.time.LocalDate.parse(endStr);
                }
                
                System.out.println("Parsed dates - Start: " + start + ", End: " + end);
            } catch (java.time.format.DateTimeParseException e) {
                System.err.println("Invalid date format. Start: " + startStr + ", End: " + endStr);
                System.err.println("Date parse error: " + e.getMessage());
                return ResponseEntity.badRequest().build();
            }
            System.out.println("Looking for lieu with ID: " + lieuId);

            Optional<Lieu> lieuOpt = lieuService.getLieuById(lieuId);
            if (lieuOpt.isEmpty()) {
                System.err.println("Lieu not found with ID: " + lieuId);
                return ResponseEntity.notFound().build();
            }
            
            Lieu lieu = lieuOpt.get();
            System.out.println("Found lieu: " + lieu.getTitre());

            Reservation reservation = Reservation.builder()
                    .lieu(lieu)
                    .locataire(tenant)
                    .dateDebut(start)
                    .dateFin(end)
                    .build();

            System.out.println("Creating reservation...");
            try {
                Reservation saved = reservationService.createReservation(reservation);
                System.out.println("Reservation created with ID: " + saved.getId());
                
                System.out.println("Mapping to response...");
                ReservationResponse response = createSimpleReservationResponse(saved);
                System.out.println("Returning response: " + response.getId());
                
                return ResponseEntity.ok(response);
            } catch (Exception serviceException) {
                System.err.println("Error in reservation service: " + serviceException.getClass().getSimpleName() + " - " + serviceException.getMessage());
                serviceException.printStackTrace();
                throw serviceException; // Re-throw to be caught by outer catch
            }
        } catch (ResourceNotFoundException e) {
            System.err.println("Resource not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid argument: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            System.err.println("Illegal state: " + e.getMessage());
            return ResponseEntity.status(409).build(); // Conflict
        } catch (org.hibernate.LazyInitializationException e) {
            System.err.println("Lazy initialization error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        } catch (Exception e) {
            System.err.println("Error creating reservation: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            System.err.println("Request body was: " + body);
            System.err.println("User ID: " + (tenant != null ? tenant.getId() : "null"));
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Tenant: Cancel reservation
    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id, Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal principal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User tenant = userService.getUserById(principal.getId());
        boolean ok = reservationService.cancelReservation(id, tenant);
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.status(403).build();
    }

    // Owner: Accept/Reject reservation
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('PROPRIETAIRE') or hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> updateReservationStatus(@PathVariable Long id,
                                                                       @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        Reservation updated = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(entityMapper.toReservationResponse(updated));
    }
    
    // Helper method to create a simple reservation response without complex mapping
    private ReservationResponse createSimpleReservationResponse(Reservation reservation) {
        try {
            // Create basic user summary
            UserSummaryResponse locataire = null;
            if (reservation.getLocataire() != null) {
                locataire = new UserSummaryResponse(
                    reservation.getLocataire().getId(),
                    reservation.getLocataire().getNom() != null ? reservation.getLocataire().getNom() : "User " + reservation.getLocataire().getId(),
                    reservation.getLocataire().getEmail() != null ? reservation.getLocataire().getEmail() : "",
                    reservation.getLocataire().getRole() != null ? reservation.getLocataire().getRole() : "LOCATAIRE"
                );
            }
            
            // Create basic lieu response
            LieuResponse lieu = null;
            if (reservation.getLieu() != null) {
                lieu = new LieuResponse(
                    reservation.getLieu().getId(),
                    reservation.getLieu().getTitre() != null ? reservation.getLieu().getTitre() : "Lieu " + reservation.getLieu().getId(),
                    reservation.getLieu().getDescription(),
                    reservation.getLieu().getType(),
                    reservation.getLieu().getPrix(),
                    reservation.getLieu().getAdresse(),
                    reservation.getLieu().isValide(),
                    null, // Skip photos for now
                    null, // Skip owner
                    null, // Skip rating
                    null  // Skip review count
                );
            }
            
            // Calculate nights and price
            Long totalNights = null;
            Double totalPrice = null;
            if (reservation.getDateDebut() != null && reservation.getDateFin() != null) {
                totalNights = java.time.temporal.ChronoUnit.DAYS.between(reservation.getDateDebut(), reservation.getDateFin());
                if (reservation.getLieu() != null && reservation.getLieu().getPrix() != null) {
                    totalPrice = reservation.getLieu().getPrix().doubleValue() * totalNights;
                }
            }
            
            return new ReservationResponse(
                reservation.getId(),
                reservation.getDateDebut(),
                reservation.getDateFin(),
                reservation.getStatut(),
                locataire,
                lieu,
                totalNights,
                totalPrice
            );
        } catch (Exception e) {
            System.err.println("Error creating simple reservation response: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create reservation response", e);
        }
    }
}
