package org.example.locaspace.service;

import org.example.locaspace.model.Avis;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.Reservation;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.AvisRepository;
import org.example.locaspace.repository.LieuRepository;
import org.example.locaspace.repository.ReservationRepository;
import org.example.locaspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminService {
    
    private final UserRepository userRepository;
    private final LieuRepository lieuRepository;
    private final ReservationRepository reservationRepository;
    private final AvisRepository avisRepository;
    
    @Autowired
    public AdminService(UserRepository userRepository, LieuRepository lieuRepository, 
                       ReservationRepository reservationRepository, AvisRepository avisRepository) {
        this.userRepository = userRepository;
        this.lieuRepository = lieuRepository;
        this.reservationRepository = reservationRepository;
        this.avisRepository = avisRepository;
    }
    
    // User Management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public boolean deleteUser(Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                userRepository.delete(user);
                return true;
            })
            .orElse(false);
    }
    
    public User updateUserRole(Long userId, String newRole) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setRole(newRole);
                return userRepository.save(user);
            })
            .orElse(null);
    }
    
    // Lieu Management
    public List<Lieu> getPendingLieux() {
        return lieuRepository.findByValideFalse();
    }
    
    public boolean validateLieu(Long lieuId) {
        return lieuRepository.findById(lieuId)
            .map(lieu -> {
                lieu.setValide(true);
                lieuRepository.save(lieu);
                return true;
            })
            .orElse(false);
    }
    
    public boolean rejectLieu(Long lieuId) {
        return lieuRepository.findById(lieuId)
            .map(lieu -> {
                lieuRepository.delete(lieu);
                return true;
            })
            .orElse(false);
    }
    
    public List<Lieu> getAllLieux() {
        return lieuRepository.findAll();
    }
    
    public boolean deleteLieu(Long lieuId) {
        return lieuRepository.findById(lieuId)
            .map(lieu -> {
                lieuRepository.delete(lieu);
                return true;
            })
            .orElse(false);
    }
    
    // Reservation Management
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    
    public List<Reservation> getReservationsByStatus(String status) {
        return reservationRepository.findByStatut(status);
    }
    
    public boolean deleteReservation(Long reservationId) {
        return reservationRepository.findById(reservationId)
            .map(reservation -> {
                reservationRepository.delete(reservation);
                return true;
            })
            .orElse(false);
    }
    
    public Reservation updateReservationStatus(Long reservationId, String newStatus) {
        return reservationRepository.findById(reservationId)
            .map(reservation -> {
                reservation.setStatut(newStatus);
                return reservationRepository.save(reservation);
            })
            .orElse(null);
    }
    
    // Review Management
    public List<Avis> getAllReviews() {
        return avisRepository.findAll();
    }
    
    public boolean deleteReview(Long avisId) {
        return avisRepository.findById(avisId)
            .map(avis -> {
                avisRepository.delete(avis);
                return true;
            })
            .orElse(false);
    }
    
    public List<Avis> getReviewsByRating(int minRating) {
        return avisRepository.findByNoteGreaterThanEqual(minRating);
    }
    
    // Statistics and Analytics
    public AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalLieux = lieuRepository.count();
        long validatedLieux = lieuRepository.findByValideTrue().size();
        long pendingLieux = lieuRepository.findByValideFalse().size();
        long totalReservations = reservationRepository.count();
        long confirmedReservations = reservationRepository.findByStatut("CONFIRMEE").size();
        long pendingReservations = reservationRepository.findByStatut("EN_ATTENTE").size();
        long totalReviews = avisRepository.count();
        
        // Calculate average rating across all reviews
        List<Avis> allReviews = avisRepository.findAll();
        double averageRating = allReviews.stream()
            .mapToInt(Avis::getNote)
            .average()
            .orElse(0.0);
        
        return new AdminDashboardStats(
            totalUsers, totalLieux, validatedLieux, pendingLieux,
            totalReservations, confirmedReservations, pendingReservations,
            totalReviews, averageRating
        );
    }
    
    public Map<String, Long> getUserRoleDistribution() {
        List<User> users = userRepository.findAll();
        Map<String, Long> distribution = new HashMap<>();
        
        users.forEach(user -> {
            String role = user.getRole() != null ? user.getRole() : "UNKNOWN";
            distribution.merge(role, 1L, Long::sum);
        });
        
        return distribution;
    }
    
    public Map<String, Long> getLieuTypeDistribution() {
        List<Lieu> lieux = lieuRepository.findByValideTrue();
        Map<String, Long> distribution = new HashMap<>();
        
        lieux.forEach(lieu -> {
            String type = lieu.getType() != null ? lieu.getType() : "UNKNOWN";
            distribution.merge(type, 1L, Long::sum);
        });
        
        return distribution;
    }
    
    public Map<String, Long> getReservationStatusDistribution() {
        List<Reservation> reservations = reservationRepository.findAll();
        Map<String, Long> distribution = new HashMap<>();
        
        reservations.forEach(reservation -> {
            String status = reservation.getStatut() != null ? reservation.getStatut() : "UNKNOWN";
            distribution.merge(status, 1L, Long::sum);
        });
        
        return distribution;
    }
    
    public List<MonthlyStats> getMonthlyReservationStats() {
        // This would typically involve more complex queries
        // For now, returning mock data structure
        return List.of(
            new MonthlyStats("2024-01", 45L),
            new MonthlyStats("2024-02", 52L),
            new MonthlyStats("2024-03", 38L)
        );
    }
    
    // Content Moderation
    public List<Avis> getFlaggedReviews() {
        // In a real implementation, this would filter reviews flagged by users
        // For now, return reviews with very low ratings as potentially problematic
        return avisRepository.findByNoteGreaterThanEqual(1).stream()
            .filter(avis -> avis.getNote() <= 2)
            .toList();
    }
    
    public boolean moderateReview(Long avisId, boolean approve) {
        return avisRepository.findById(avisId)
            .map(avis -> {
                if (!approve) {
                    avisRepository.delete(avis);
                }
                // In a real implementation, you might have a 'moderated' flag
                return true;
            })
            .orElse(false);
    }
    
    // System Health
    public SystemHealthStats getSystemHealth() {
        long activeUsers = userRepository.findAll().stream()
            .filter(user -> user.getReservations() != null && !user.getReservations().isEmpty())
            .count();
        
        long activeLieux = lieuRepository.findByValideTrue().stream()
            .filter(lieu -> lieu.getReservations() != null && !lieu.getReservations().isEmpty())
            .count();
        
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        long recentReservations = reservationRepository.findAll().stream()
            .filter(r -> r.getDateDebut().isAfter(thirtyDaysAgo))
            .count();
        
        return new SystemHealthStats(activeUsers, activeLieux, recentReservations);
    }
    
    // Inner classes for statistics
    public static class AdminDashboardStats {
        private long totalUsers;
        private long totalLieux;
        private long validatedLieux;
        private long pendingLieux;
        private long totalReservations;
        private long confirmedReservations;
        private long pendingReservations;
        private long totalReviews;
        private double averageRating;
        
        public AdminDashboardStats(long totalUsers, long totalLieux, long validatedLieux, long pendingLieux,
                                 long totalReservations, long confirmedReservations, long pendingReservations,
                                 long totalReviews, double averageRating) {
            this.totalUsers = totalUsers;
            this.totalLieux = totalLieux;
            this.validatedLieux = validatedLieux;
            this.pendingLieux = pendingLieux;
            this.totalReservations = totalReservations;
            this.confirmedReservations = confirmedReservations;
            this.pendingReservations = pendingReservations;
            this.totalReviews = totalReviews;
            this.averageRating = averageRating;
        }
        
        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getTotalLieux() { return totalLieux; }
        public long getValidatedLieux() { return validatedLieux; }
        public long getPendingLieux() { return pendingLieux; }
        public long getTotalReservations() { return totalReservations; }
        public long getConfirmedReservations() { return confirmedReservations; }
        public long getPendingReservations() { return pendingReservations; }
        public long getTotalReviews() { return totalReviews; }
        public double getAverageRating() { return averageRating; }
    }
    
    public static class MonthlyStats {
        private String month;
        private Long count;
        
        public MonthlyStats(String month, Long count) {
            this.month = month;
            this.count = count;
        }
        
        public String getMonth() { return month; }
        public Long getCount() { return count; }
    }
    
    public static class SystemHealthStats {
        private long activeUsers;
        private long activeLieux;
        private long recentReservations;
        
        public SystemHealthStats(long activeUsers, long activeLieux, long recentReservations) {
            this.activeUsers = activeUsers;
            this.activeLieux = activeLieux;
            this.recentReservations = recentReservations;
        }
        
        public long getActiveUsers() { return activeUsers; }
        public long getActiveLieux() { return activeLieux; }
        public long getRecentReservations() { return recentReservations; }
    }
}
