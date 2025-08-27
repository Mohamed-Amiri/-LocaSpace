package org.example.locaspace.service;


import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.LieuRepository;
import org.example.locaspace.repository.AvisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LieuService {
    
    private final LieuRepository lieuRepository;
    private final AvisRepository avisRepository;
    
    @Autowired
    public LieuService(LieuRepository lieuRepository, AvisRepository avisRepository) {
        this.lieuRepository = lieuRepository;
        this.avisRepository = avisRepository;
    }
    
    // Create new lieu
    public Lieu createLieu(Lieu lieu) {
        lieu.setValide(false); 
        return lieuRepository.save(lieu);
    }
    
    // Get all validated lieux (public)
    public List<Lieu> getAllValidatedLieux() {
        return lieuRepository.findByValideTrue();
    }
    
    // Get lieu by ID
    public Optional<Lieu> getLieuById(Long id) {
        return lieuRepository.findById(id);
    }
    
    // Get lieux by owner
    public List<Lieu> getLieuxByOwner(User owner) {
        return lieuRepository.findByOwner(owner);
    }
    
    // Update lieu (only owner can update)
    public Lieu updateLieu(Long id, Lieu updatedLieu, User currentUser) {
        return lieuRepository.findById(id)
            .filter(lieu -> lieu.getOwner().getId().equals(currentUser.getId()))
            .map(lieu -> {
                lieu.setTitre(updatedLieu.getTitre());
                lieu.setDescription(updatedLieu.getDescription());
                lieu.setType(updatedLieu.getType());
                lieu.setPrix(updatedLieu.getPrix());
                lieu.setAdresse(updatedLieu.getAdresse());
                lieu.setPhotos(updatedLieu.getPhotos());
                lieu.setValide(false); // Require re-validation after update
                return lieuRepository.save(lieu);
            })
            .orElse(null);
    }
    
    // Delete lieu (owner or admin)
    public boolean deleteLieu(Long id, User currentUser) {
        return lieuRepository.findById(id)
            .map(lieu -> {
                // Check if user is owner or admin
                if (lieu.getOwner().getId().equals(currentUser.getId()) || 
                    "ADMIN".equals(currentUser.getRole())) {
                    lieuRepository.delete(lieu);
                    return true;
                }
                return false;
            })
            .orElse(false);
    }
    
    // Admin: Validate lieu
    public boolean validateLieu(Long id) {
        return lieuRepository.findById(id)
            .map(lieu -> {
                lieu.setValide(true);
                lieuRepository.save(lieu);
                return true;
            })
            .orElse(false);
    }
    
    // Admin: Get unvalidated lieux
    public List<Lieu> getUnvalidatedLieux() {
        return lieuRepository.findByValideFalse();
    }
    
    // Search functionality
    public List<Lieu> searchLieux(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllValidatedLieux();
        }
        return lieuRepository.searchByKeyword(keyword.trim());
    }
    
    // Filter by type
    public List<Lieu> getLieuxByType(String type) {
        return lieuRepository.findByType(type);
    }
    
    // Filter by price range
    public List<Lieu> getLieuxByPriceRange(BigDecimal minPrix, BigDecimal maxPrix) {
        return lieuRepository.findByPrixBetween(minPrix, maxPrix);
    }
    
    // Filter by city
    public List<Lieu> getLieuxByCity(String ville) {
        return lieuRepository.findByAdresseContainingIgnoreCase(ville);
    }
    
    // Advanced search with multiple filters
    public List<Lieu> searchLieuxWithFilters(String type, BigDecimal minPrix, BigDecimal maxPrix, String ville) {
        List<Lieu> results = getAllValidatedLieux();
        
        if (type != null && !type.isEmpty()) {
            results = results.stream()
                .filter(lieu -> type.equals(lieu.getType()))
                .toList();
        }
        
        if (minPrix != null && maxPrix != null) {
            results = results.stream()
                .filter(lieu -> lieu.getPrix().compareTo(minPrix) >= 0 && 
                               lieu.getPrix().compareTo(maxPrix) <= 0)
                .toList();
        }
        
        if (ville != null && !ville.isEmpty()) {
            results = results.stream()
                .filter(lieu -> lieu.getAdresse().toLowerCase().contains(ville.toLowerCase()))
                .toList();
        }
        
        return results;
    }
    
    // Get lieu statistics
    public LieuStats getLieuStats(Long lieuId) {
        return lieuRepository.findById(lieuId)
            .map(lieu -> {
                Double averageRating = avisRepository.findAverageNoteByLieu(lieu);
                Long reviewCount = avisRepository.countByLieu(lieu);
                
                return new LieuStats(
                    lieu.getId(),
                    averageRating != null ? averageRating : 0.0,
                    reviewCount
                );
            })
            .orElse(null);
    }
    
    // Get owner statistics
    public OwnerStats getOwnerStats(User owner) {
        Long lieuCount = lieuRepository.countByOwner(owner);
        List<Lieu> ownerLieux = lieuRepository.findByOwner(owner);
        
        double totalRating = 0.0;
        long totalReviews = 0;
        
        for (Lieu lieu : ownerLieux) {
            Double avgRating = avisRepository.findAverageNoteByLieu(lieu);
            Long reviewCount = avisRepository.countByLieu(lieu);
            
            if (avgRating != null) {
                totalRating += avgRating * reviewCount;
                totalReviews += reviewCount;
            }
        }
        
        double overallRating = totalReviews > 0 ? totalRating / totalReviews : 0.0;
        
        return new OwnerStats(
            owner.getId(),
            lieuCount,
            overallRating,
            totalReviews
        );
    }
    
    // Inner classes for statistics
    public static class LieuStats {
        private Long lieuId;
        private Double averageRating;
        private Long reviewCount;
        
        public LieuStats(Long lieuId, Double averageRating, Long reviewCount) {
            this.lieuId = lieuId;
            this.averageRating = averageRating;
            this.reviewCount = reviewCount;
        }
        
        // Getters
        public Long getLieuId() { return lieuId; }
        public Double getAverageRating() { return averageRating; }
        public Long getReviewCount() { return reviewCount; }
    }
    
    public static class OwnerStats {
        private Long ownerId;
        private Long lieuCount;
        private Double overallRating;
        private Long totalReviews;
        
        public OwnerStats(Long ownerId, Long lieuCount, Double overallRating, Long totalReviews) {
            this.ownerId = ownerId;
            this.lieuCount = lieuCount;
            this.overallRating = overallRating;
            this.totalReviews = totalReviews;
        }
        
        // Getters
        public Long getOwnerId() { return ownerId; }
        public Long getLieuCount() { return lieuCount; }
        public Double getOverallRating() { return overallRating; }
        public Long getTotalReviews() { return totalReviews; }
    }
}
