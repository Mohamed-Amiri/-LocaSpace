package org.example.locaspace.repository;

import org.example.locaspace.model.Notification;
import org.example.locaspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    List<Notification> findByRecipientAndLuFalseOrderByCreatedAtDesc(User recipient);

    long countByRecipientAndLuFalse(User recipient);

    Optional<Notification> findByIdAndRecipient(Long id, User recipient);
}
