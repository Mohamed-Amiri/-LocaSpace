package org.example.locaspace.mapper;

import org.example.locaspace.dto.avis.AvisResponse;
import org.example.locaspace.dto.lieu.LieuResponse;
import org.example.locaspace.dto.reservation.ReservationResponse;
import org.example.locaspace.dto.user.UserResponse;
import org.example.locaspace.dto.user.UserSummaryResponse;
import org.example.locaspace.model.Avis;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.Reservation;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.AvisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class EntityMapper {
    
    @Autowired
    private AvisRepository avisRepository;
    
    // User mappings
    public UserSummaryResponse toUserSummaryResponse(User user) {
        if (user == null) return null;
        
        return new UserSummaryResponse(
            user.getId(),
            user.getNom(),
            user.getEmail(),
            user.getRole()
        );
    }
    
    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        
        Long totalReservations = user.getReservations() != null ? (long) user.getReservations().size() : 0L;
        Long totalReviews = user.getAvis() != null ? (long) user.getAvis().size() : 0L;
        
        // Calculate average rating for user's reviews
        Double averageRating = null;
        if (user.getAvis() != null && !user.getAvis().isEmpty()) {
            averageRating = user.getAvis().stream()
                .mapToInt(avis -> avis.getNote())
                .average()
                .orElse(0.0);
        }
        
        return new UserResponse(
            user.getId(),
            user.getNom(),
            user.getEmail(),
            user.getRole(),
            null, // createdAt - would need to add this field to User entity
            totalReservations,
            totalReviews,
            averageRating
        );
    }
    
    // Lieu mappings
    public LieuResponse toLieuResponse(Lieu lieu) {
        if (lieu == null) return null;
        
        UserSummaryResponse owner = toUserSummaryResponse(lieu.getOwner());
        
        // Calculate average rating and review count
        Double averageRating = avisRepository.findAverageNoteByLieu(lieu);
        Long reviewCount = avisRepository.countByLieu(lieu);
        
        return new LieuResponse(
            lieu.getId(),
            lieu.getTitre(),
            lieu.getDescription(),
            lieu.getType(),
            lieu.getPrix(),
            lieu.getAdresse(),
            lieu.isValide(),
            lieu.getPhotos(),
            owner,
            averageRating,
            reviewCount
        );
    }
    
    // Reservation mappings
    public ReservationResponse toReservationResponse(Reservation reservation) {
        if (reservation == null) return null;
        
        try {
            System.out.println("Mapping reservation with ID: " + reservation.getId());
            
            UserSummaryResponse locataire = null;
            if (reservation.getLocataire() != null) {
                System.out.println("Mapping locataire: " + reservation.getLocataire().getId());
                try {
                    String nom = safeGetString(reservation.getLocataire()::getNom, "User " + reservation.getLocataire().getId());
                    String email = safeGetString(reservation.getLocataire()::getEmail, "");
                    String role = safeGetString(reservation.getLocataire()::getRole, "LOCATAIRE");
                    
                    locataire = new UserSummaryResponse(
                        reservation.getLocataire().getId(),
                        nom,
                        email,
                        role
                    );
                } catch (Exception e) {
                    System.err.println("Error mapping locataire: " + e.getMessage());
                    // Create minimal response if full mapping fails
                    locataire = new UserSummaryResponse(
                        reservation.getLocataire().getId(),
                        "User " + reservation.getLocataire().getId(),
                        "",
                        "LOCATAIRE"
                    );
                }
            }
            
            LieuResponse lieu = null;
            if (reservation.getLieu() != null) {
                System.out.println("Mapping lieu: " + reservation.getLieu().getId());
                try {
                    String titre = safeGetString(reservation.getLieu()::getTitre, "Lieu " + reservation.getLieu().getId());
                    String description = safeGetString(reservation.getLieu()::getDescription, "");
                    String type = safeGetString(reservation.getLieu()::getType, "");
                    String adresse = safeGetString(reservation.getLieu()::getAdresse, "");
                    
                    lieu = new LieuResponse(
                        reservation.getLieu().getId(),
                        titre,
                        description,
                        type,
                        reservation.getLieu().getPrix(),
                        adresse,
                        reservation.getLieu().isValide(),
                        safeGetList(reservation.getLieu()::getPhotos),
                        null, // Skip owner to avoid lazy loading issues
                        null, // Skip rating
                        null  // Skip review count
                    );
                } catch (Exception e) {
                    System.err.println("Error mapping lieu: " + e.getMessage());
                    e.printStackTrace();
                    // Create minimal response if full mapping fails
                    lieu = new LieuResponse(
                        reservation.getLieu().getId(),
                        "Lieu " + reservation.getLieu().getId(),
                        "",
                        "",
                        reservation.getLieu().getPrix(),
                        "",
                        true,
                        null,
                        null,
                        null,
                        null
                    );
                }
            }
            
            // Calculate total nights and price
            Long totalNights = null;
            Double totalPrice = null;
            
            if (reservation.getDateDebut() != null && reservation.getDateFin() != null) {
                totalNights = ChronoUnit.DAYS.between(reservation.getDateDebut(), reservation.getDateFin());
                if (reservation.getLieu() != null && reservation.getLieu().getPrix() != null) {
                    totalPrice = reservation.getLieu().getPrix().doubleValue() * totalNights;
                }
            }
            
            System.out.println("Creating ReservationResponse...");
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
            System.err.println("Error mapping reservation to response: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to map reservation", e);
        }
    }
    
    // Helper methods for safe property access
    private String safeGetString(java.util.function.Supplier<String> supplier, String defaultValue) {
        try {
            String value = supplier.get();
            return value != null ? value : defaultValue;
        } catch (Exception e) {
            System.err.println("Error accessing string property: " + e.getMessage());
            return defaultValue;
        }
    }
    
    private java.util.List<String> safeGetList(java.util.function.Supplier<java.util.List<String>> supplier) {
        try {
            return supplier.get();
        } catch (Exception e) {
            System.err.println("Error accessing list property: " + e.getMessage());
            return null;
        }
    }
    
    // Simplified lieu response for reservation (to avoid circular references)
    public LieuResponse toLieuSummaryResponse(Lieu lieu) {
        if (lieu == null) return null;
        
        return new LieuResponse(
            lieu.getId(),
            lieu.getTitre(),
            lieu.getDescription(),
            lieu.getType(),
            lieu.getPrix(),
            lieu.getAdresse(),
            lieu.isValide(),
            lieu.getPhotos(),
            null, // No owner details in summary
            null, // No rating in summary
            null  // No review count in summary
        );
    }
    
    // Avis mappings
    public AvisResponse toAvisResponse(Avis avis) {
        if (avis == null) return null;
        
        return AvisResponse.builder()
            .id(avis.getId())
            .note(avis.getNote())
            .commentaire(avis.getCommentaire())
            .dateCreation(null) // Would need to add createdAt field to Avis entity
            .auteurId(avis.getAuteur() != null ? avis.getAuteur().getId() : null)
            .auteurNom(avis.getAuteur() != null ? avis.getAuteur().getNom() : null)
            .lieuId(avis.getLieu() != null ? avis.getLieu().getId() : null)
            .lieuTitre(avis.getLieu() != null ? avis.getLieu().getTitre() : null)
            .build();
    }
}