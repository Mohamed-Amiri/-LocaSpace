package org.example.locaspace.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    // User management
    @PutMapping("/users/{id}/block")
    public void blockUser(@PathVariable Long id) {}

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {}

    // Lieu management
    @PutMapping("/lieux/{id}/validate")
    public void validateLieu(@PathVariable Long id) {}

    @DeleteMapping("/lieux/{id}")
    public void deleteLieu(@PathVariable Long id) {}

    // Statistics
    @GetMapping("/stats")
    public Map<String, Object> getStats() { return null; }
}
