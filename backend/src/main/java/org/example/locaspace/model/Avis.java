package org.example.locaspace.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "avis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Avis {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int note;
    @Column(length = 1000)
    private String commentaire;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User auteur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lieu_id")
    private Lieu lieu;
}
