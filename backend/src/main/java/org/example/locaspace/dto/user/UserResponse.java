package org.example.locaspace.dto.user;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String nom;
    private String email;
    private String role;
    private LocalDateTime createdAt;
    private Long totalReservations;
    private Long totalReviews;
    private Double averageRating;
    
    // Constructors
    public UserResponse() {}
    
    public UserResponse(Long id, String nom, String email, String role, LocalDateTime createdAt,
                       Long totalReservations, Long totalReviews, Double averageRating) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.totalReservations = totalReservations;
        this.totalReviews = totalReviews;
        this.averageRating = averageRating;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Long getTotalReservations() {
        return totalReservations;
    }
    
    public void setTotalReservations(Long totalReservations) {
        this.totalReservations = totalReservations;
    }
    
    public Long getTotalReviews() {
        return totalReviews;
    }
    
    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}