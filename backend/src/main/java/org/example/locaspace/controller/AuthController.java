package org.example.locaspace.controller;

import jakarta.validation.Valid;
import org.example.locaspace.dto.auth.JwtResponse;
import org.example.locaspace.dto.auth.LoginRequest;
import org.example.locaspace.dto.auth.RegisterRequest;
import org.example.locaspace.exception.BadRequestException;


import org.example.locaspace.model.User;
import org.example.locaspace.repository.UserRepository;
import org.example.locaspace.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder encoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        org.example.locaspace.security.UserDetailsServiceImpl.UserPrincipal userDetails = 
            (org.example.locaspace.security.UserDetailsServiceImpl.UserPrincipal) authentication.getPrincipal();
        
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
        
        // Get user details from database
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new BadRequestException("User not found"));
        
        // Map backend role to frontend role for routing
        String frontendRole = mapBackendRoleToFrontend(user.getRole());
        
        JwtResponse response = new JwtResponse(jwt,
                                             userDetails.getId(),
                                             userDetails.getUsername(),
                                             user.getNom(),
                                             roles);
        response.setFrontendRole(frontendRole);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new BadRequestException("Error: Email is already in use!");
        }
        
        // Map frontend roles to backend roles
        String backendRole = mapFrontendRoleToBackend(signUpRequest.getRole());
        
        // Create new user's account
        User user = User.builder()
            .nom(signUpRequest.getNom())
            .email(signUpRequest.getEmail())
            .motDePasse(encoder.encode(signUpRequest.getPassword()))
            .role(backendRole)
            .build();
        
        userRepository.save(user);
        
        return ResponseEntity.ok("User registered successfully!");
    }
    
    private String mapFrontendRoleToBackend(String frontendRole) {
        switch (frontendRole.toUpperCase()) {
            case "TENANT":
                return "LOCATAIRE";
            case "OWNER":
                return "PROPRIETAIRE";
            case "ADMIN":
                return "ADMIN";
            default:
                return "LOCATAIRE"; // Default fallback
        }
    }
    
    private String mapBackendRoleToFrontend(String backendRole) {
        switch (backendRole.toUpperCase()) {
            case "LOCATAIRE":
                return "tenant";
            case "PROPRIETAIRE":
                return "owner";
            case "ADMIN":
                return "admin";
            default:
                return "tenant"; // Default fallback
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser() {
        // In a stateless JWT setup, logout is typically handled client-side
        // by removing the token. However, you could implement token blacklisting here.
        return ResponseEntity.ok("User logged out successfully!");
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            if (jwtUtils.validateJwtToken(token)) {
                String email = jwtUtils.getUserNameFromJwtToken(token);
                User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadRequestException("User not found"));
                
                // Create new authentication for token generation
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(email, null, null);
                
                String newJwt = jwtUtils.generateJwtToken(authentication);
                
                return ResponseEntity.ok(new JwtRefreshResponse(newJwt));
            } else {
                return ResponseEntity.badRequest().body("Token is invalid");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token refresh failed");
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            if (jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.ok("Token is valid");
            } else {
                return ResponseEntity.badRequest().body("Token is invalid");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token validation failed");
        }
    }
    
    // Inner class for refresh response
    public static class JwtRefreshResponse {
        private String accessToken;
        private String tokenType = "Bearer";
        
        public JwtRefreshResponse(String accessToken) {
            this.accessToken = accessToken;
        }
        
        public String getAccessToken() {
            return accessToken;
        }
        
        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }
        
        public String getTokenType() {
            return tokenType;
        }
        
        public void setTokenType(String tokenType) {
            this.tokenType = tokenType;
        }
    }
}
