package org.example.locaspace.service;

import org.example.locaspace.model.Notification;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByRecipientAndLuFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndLuFalse(user);
    }

    public void createNotification(User recipient, String title, String message, Notification.NotificationType type) {
        Notification notification = Notification.builder()
            .recipient(recipient)
            .title(title)
            .message(message)
            .type(type)
            .lu(false)
            .build();
        notificationRepository.save(notification);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setLu(true);
            notificationRepository.save(n);
        });
    }

    public boolean markAsReadForUser(Long notificationId, User user) {
        return notificationRepository.findByIdAndRecipient(notificationId, user)
            .map(n -> {
                n.setLu(true);
                notificationRepository.save(n);
                return true;
            })
            .orElse(false);
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByRecipientAndLuFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setLu(true));
        notificationRepository.saveAll(unread);
    }
}
