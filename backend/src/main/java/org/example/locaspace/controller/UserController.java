package org.example.locaspace.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.example.locaspace.model.User;
import org.example.locaspace.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create (Registration)
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User createdUser = userService.registerUser(user);
        return ResponseEntity.ok(createdUser);
    }

    // Read (Profile)
    @GetMapping("/me")
    public ResponseEntity<User> getProfile() {
        // For demo: get user with id 1 (replace with authentication logic)
        User user = userService.getUserById(1L);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    // Update (Profile)
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser) {
        // For demo: update user with id 1 (replace with authentication logic)
        User user = userService.updateUser(1L, updatedUser);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    // Delete (Self-delete)
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteProfile() {
        // For demo: delete user with id 1 (replace with authentication logic)
        userService.deleteUser(1L);
        return ResponseEntity.noContent().build();
    }

    // Admin: List all users
    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Admin: Block/Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Get own reservations
    @GetMapping("/me/reservations")
    public List<?> getMyReservations() { return null; }



    // Admin: Change user role
    @PutMapping("/{id}/role")
    public void changeUserRole(@PathVariable Long id) {}

    // Admin: Block/Unblock user
    @PutMapping("/{id}/block")
    public void blockUser(@PathVariable Long id) {}

    // Admin: Delete user review
    @DeleteMapping("/avis/{id}")
    public void deleteAvis(@PathVariable Long id) {}
}
