package org.example.locaspace.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity @Table(name = "lieux")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lieu {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    @Column(length = 1000)
    private String description;
    private String type;
    private BigDecimal prix;
    private String adresse;
    private boolean valide;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;


    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;


    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avis> avis;
}
