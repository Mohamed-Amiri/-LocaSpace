package org.example.locaspace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "LocaSpace API");
        health.put("version", "1.0.0");
        
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/secure")
    public ResponseEntity<Map<String, Object>> secureHealthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("message", "Authenticated endpoint working");
        health.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(health);
    }
}