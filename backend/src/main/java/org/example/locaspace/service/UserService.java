package org.example.locaspace.service;

import org.example.locaspace.exception.BadRequestException;
import org.example.locaspace.exception.ResourceNotFoundException;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new BadRequestException("Email is already in use");
        }
        
        // Encode password
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        
        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("LOCATAIRE");
        }
        
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setNom(updatedUser.getNom());
            
            // Check if email is being changed and if new email already exists
            if (!user.getEmail().equals(updatedUser.getEmail())) {
                if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                    throw new BadRequestException("Email is already in use");
                }
                user.setEmail(updatedUser.getEmail());
            }
            
            // Only encode password if it's being changed
            if (updatedUser.getMotDePasse() != null && !updatedUser.getMotDePasse().isEmpty()) {
                user.setMotDePasse(passwordEncoder.encode(updatedUser.getMotDePasse()));
            }
            
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            
            return userRepository.save(user);
        }).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
