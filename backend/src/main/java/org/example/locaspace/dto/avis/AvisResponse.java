package org.example.locaspace.dto.avis;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AvisResponse {

    private Long id;
    private Integer note;
    private String commentaire;
    private LocalDateTime dateCreation;
    
    // Author information
    private Long auteurId;
    private String auteurNom;
    
    // Place information
    private Long lieuId;
    private String lieuTitre;
}