package org.example.locaspace.dto.reservation;

import org.example.locaspace.dto.lieu.LieuResponse;
import org.example.locaspace.dto.user.UserSummaryResponse;

import java.time.LocalDate;

public class ReservationResponse {
    private Long id;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut;
    private UserSummaryResponse locataire;
    private LieuResponse lieu;
    private Long totalNights;
    private Double totalPrice;
    
    // Constructors
    public ReservationResponse() {}
    
    public ReservationResponse(Long id, LocalDate dateDebut, LocalDate dateFin, String statut,
                             UserSummaryResponse locataire, LieuResponse lieu, Long totalNights, Double totalPrice) {
        this.id = id;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
        this.locataire = locataire;
        this.lieu = lieu;
        this.totalNights = totalNights;
        this.totalPrice = totalPrice;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDate getDateDebut() {
        return dateDebut;
    }
    
    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }
    
    public LocalDate getDateFin() {
        return dateFin;
    }
    
    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
    
    public String getStatut() {
        return statut;
    }
    
    public void setStatut(String statut) {
        this.statut = statut;
    }
    
    public UserSummaryResponse getLocataire() {
        return locataire;
    }
    
    public void setLocataire(UserSummaryResponse locataire) {
        this.locataire = locataire;
    }
    
    public LieuResponse getLieu() {
        return lieu;
    }
    
    public void setLieu(LieuResponse lieu) {
        this.lieu = lieu;
    }
    
    public Long getTotalNights() {
        return totalNights;
    }
    
    public void setTotalNights(Long totalNights) {
        this.totalNights = totalNights;
    }
    
    public Double getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}