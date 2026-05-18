package org.example.locaspace.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.locaspace.model.enums.LieuType;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.util.List;

@Entity @Table(name = "lieux")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE lieux SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class Lieu {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    @Column(length = 1000)
    private String description;
    @Enumerated(EnumType.STRING)
    private LieuType type;
    private BigDecimal prix;
    private String adresse;
    private boolean valide;

    @Builder.Default
    private boolean deleted = false;

    @ElementCollection
    @CollectionTable(name = "lieu_photos", joinColumns = @JoinColumn(name = "lieu_id"))
    @Column(name = "photo_url")
    private List<String> photos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;


    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;


    @OneToMany(mappedBy = "lieu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avis> avis;
}
