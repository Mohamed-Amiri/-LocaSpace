package org.example.locaspace.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean lu; // "read" in French
    
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User recipient;

    public enum NotificationType {
        RESERVATION_NEW,
        RESERVATION_CONFIRMED,
        RESERVATION_CANCELLED,
        AVIS_NEW,
        SYSTEM
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lu = false;
    }
}
