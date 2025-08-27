package org.example.locaspace.dto.reservation;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import org.example.locaspace.validation.ValidDateRange;

import java.time.LocalDate;

@ValidDateRange
public class ReservationRequest {
    
    @NotNull(message = "Lieu ID is required")
    private Long lieuId;
    
    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate dateDebut;
    
    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate dateFin;
    
    // Constructors
    public ReservationRequest() {}
    
    public ReservationRequest(Long lieuId, LocalDate dateDebut, LocalDate dateFin) {
        this.lieuId = lieuId;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }
    
    // Custom validation method
    public boolean isValidDateRange() {
        if (dateDebut == null || dateFin == null) {
            return false;
        }
        return dateDebut.isBefore(dateFin);
    }
    
    // Getters and Setters
    public Long getLieuId() {
        return lieuId;
    }
    
    public void setLieuId(Long lieuId) {
        this.lieuId = lieuId;
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
}