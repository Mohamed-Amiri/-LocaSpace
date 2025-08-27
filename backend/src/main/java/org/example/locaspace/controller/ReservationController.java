package org.example.locaspace.controller;

import org.example.locaspace.dto.reservation.ReservationResponse;
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
        UserDetailsServiceImpl.UserPrincipal principal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        User tenant = userService.getUserById(principal.getId());

        Object placeIdObj = body.get("placeId");
        Object startObj = body.get("startDate");
        Object endObj = body.get("endDate");

        if (placeIdObj == null || startObj == null || endObj == null) {
            return ResponseEntity.badRequest().build();
        }

        Long lieuId = Long.valueOf(placeIdObj.toString());
        String startStr = startObj.toString();
        String endStr = endObj.toString();
        java.time.LocalDate start = java.time.LocalDate.parse(startStr.substring(0, Math.min(10, startStr.length())));
        java.time.LocalDate end = java.time.LocalDate.parse(endStr.substring(0, Math.min(10, endStr.length())));

        Lieu lieu = lieuService.getLieuById(lieuId).orElseThrow(() -> new ResourceNotFoundException("Lieu", "id", lieuId));

        Reservation reservation = Reservation.builder()
                .lieu(lieu)
                .locataire(tenant)
                .dateDebut(start)
                .dateFin(end)
                .build();

        Reservation saved = reservationService.createReservation(reservation);
        return ResponseEntity.ok(entityMapper.toReservationResponse(saved));
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
}
