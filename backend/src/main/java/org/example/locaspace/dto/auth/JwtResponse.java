package org.example.locaspace.dto.auth;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String nom;
    private List<String> roles;
    private String frontendRole; // For frontend routing
    
    public JwtResponse(String accessToken, Long id, String email, String nom, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.nom = nom;
        this.roles = roles;
    }
    
    // Getters and Setters
    public String getAccessToken() {
        return token;
    }
    
    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }
    
    public String getTokenType() {
        return type;
    }
    
    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public List<String> getRoles() {
        return roles;
    }
    
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
    
    public String getFrontendRole() {
        return frontendRole;
    }
    
    public void setFrontendRole(String frontendRole) {
        this.frontendRole = frontendRole;
    }
}