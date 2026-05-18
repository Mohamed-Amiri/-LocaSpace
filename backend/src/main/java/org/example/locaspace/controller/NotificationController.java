package org.example.locaspace.controller;

import org.example.locaspace.dto.notification.NotificationResponse;
import org.example.locaspace.model.User;
import org.example.locaspace.security.UserDetailsServiceImpl;
import org.example.locaspace.service.NotificationService;
import org.example.locaspace.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<NotificationResponse> responses = notificationService.getNotificationsForUser(user).stream()
            .map(n -> NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType().name())
                .lu(n.isLu())
                .createdAt(n.getCreatedAt())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        boolean updated = notificationService.markAsReadForUser(id, user);
        return updated ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.markAllAsRead(user);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(Authentication authentication) {
        UserDetailsServiceImpl.UserPrincipal principal = (UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        return userService.getUserById(principal.getId());
    }
}
