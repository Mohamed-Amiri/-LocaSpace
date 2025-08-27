package org.example.locaspace.dto.lieu;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public class LieuRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String titre;
    
    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 1000, message = "Description must be between 20 and 1000 characters")
    private String description;
    
    @NotBlank(message = "Type is required")
    @Pattern(regexp = "^(Appartement|Maison|Villa|Studio|Loft|Chambre)$", 
             message = "Type must be one of: Appartement, Maison, Villa, Studio, Loft, Chambre")
    private String type;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "10.0", message = "Price must be at least 10€")
    @DecimalMax(value = "10000.0", message = "Price cannot exceed 10000€")
    private BigDecimal prix;
    
    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 200, message = "Address must be between 10 and 200 characters")
    private String adresse;
    
    @Size(max = 10, message = "Maximum 10 photos allowed")
    private List<String> photos;
    
    // Constructors
    public LieuRequest() {}
    
    public LieuRequest(String titre, String description, String type, BigDecimal prix, String adresse, List<String> photos) {
        this.titre = titre;
        this.description = description;
        this.type = type;
        this.prix = prix;
        this.adresse = adresse;
        this.photos = photos;
    }
    
    // Getters and Setters
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
    
    public List<String> getPhotos() {
        return photos;
    }
    
    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }
}