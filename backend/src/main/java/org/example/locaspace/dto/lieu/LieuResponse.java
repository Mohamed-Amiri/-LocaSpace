package org.example.locaspace.dto.lieu;

import org.example.locaspace.dto.user.UserSummaryResponse;

import java.math.BigDecimal;
import java.util.List;

public class LieuResponse {
    private Long id;
    private String titre;
    private String description;
    private String type;
    private BigDecimal prix;
    private String adresse;
    private boolean valide;
    private List<String> photos;
    private UserSummaryResponse owner;
    private Double averageRating;
    private Long reviewCount;
    
    // Constructors
    public LieuResponse() {}
    
    public LieuResponse(Long id, String titre, String description, String type, BigDecimal prix, 
                       String adresse, boolean valide, List<String> photos, UserSummaryResponse owner,
                       Double averageRating, Long reviewCount) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.type = type;
        this.prix = prix;
        this.adresse = adresse;
        this.valide = valide;
        this.photos = photos;
        this.owner = owner;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitre() {
        return titre;
    }
    
    public void setTitre(String titre) {
        this.titre = titre;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public BigDecimal getPrix() {
        return prix;
    }
    
    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }
    
    public String getAdresse() {
        return adresse;
    }
    
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    
    public boolean isValide() {
        return valide;
    }
    
    public void setValide(boolean valide) {
        this.valide = valide;
    }
    
    public List<String> getPhotos() {
        return photos;
    }
    
    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }
    
    public UserSummaryResponse getOwner() {
        return owner;
    }
    
    public void setOwner(UserSummaryResponse owner) {
        this.owner = owner;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Long getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }
}