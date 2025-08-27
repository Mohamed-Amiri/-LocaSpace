package org.example.locaspace.dto.user;

public class UserSummaryResponse {
    private Long id;
    private String nom;
    private String email;
    private String role;
    
    // Constructors
    public UserSummaryResponse() {}
    
    public UserSummaryResponse(Long id, String nom, String email, String role) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.role = role;
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
}