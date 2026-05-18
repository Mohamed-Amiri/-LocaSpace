package org.example.locaspace.service;

import org.example.locaspace.exception.BadRequestException;
import org.example.locaspace.exception.ResourceNotFoundException;
import org.example.locaspace.model.User;
import org.example.locaspace.model.enums.Role;
import org.example.locaspace.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void registerUser_shouldEncodePasswordAndSetDefaultRole() {
        User user = new User();
        user.setNom("John Doe");
        user.setEmail("john@example.com");
        user.setMotDePasse("plain");
        user.setRole(null);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("plain")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.registerUser(user);

        assertEquals("encoded", result.getMotDePasse());
        assertEquals(Role.LOCATAIRE, result.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_shouldRejectDuplicateEmail() {
        User existing = new User();
        existing.setEmail("taken@example.com");

        User user = new User();
        user.setEmail("taken@example.com");
        user.setMotDePasse("password");

        when(userRepository.findByEmail("taken@example.com")).thenReturn(Optional.of(existing));

        assertThrows(BadRequestException.class, () -> userService.registerUser(user));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_shouldThrowWhenMissing() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(999L));
    }
}
