package org.example.locaspace.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "calendar_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lieu_id")
    private Lieu lieu;

    private LocalDate startDate;
    private LocalDate endDate;

    // 'booked' or 'blocked'
    private String type;

    private String title;
}





