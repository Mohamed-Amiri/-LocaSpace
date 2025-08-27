package org.example.locaspace.service;

import org.example.locaspace.exception.BadRequestException;
import org.example.locaspace.exception.ResourceNotFoundException;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService
 * 
 * This test class demonstrates:
 * 1. How to mock dependencies using @Mock
 * 2. How to inject mocks using @InjectMocks
 * 3. How to test different scenarios (success, failure, edge cases)
 * 4. How to verify method calls and return values
 * 5. How to test exception handling
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    // Mock the dependencies that UserService uses
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    // Inject the mocks into the UserService instance
    @InjectMocks
    private UserService userService;
    
    // Test data that we'll use across multiple tests
    private User testUser;
    private User existingUser;
    
    /**
     * Set up test data before each test
     * This method runs before each individual test method
     */
    @BeforeEach
    void setUp() {
        // Create a test user for registration
        testUser = new User();
        testUser.setId(1L);
        testUser.setNom("John Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setMotDePasse("plainPassword");
        testUser.setRole("LOCATAIRE");
        
        // Create an existing user for update tests
        existingUser = new User();
        existingUser.setId(2L);
        existingUser.setNom("Jane Smith");
        existingUser.setEmail("jane.smith@example.com");
        existingUser.setMotDePasse("encodedPassword");
        existingUser.setRole("PROPRIETAIRE");
    }

    /**
     * Test Case 1: Successful user registration
     * This tests the happy path - when everything works correctly
     */
    @Test
    @DisplayName("Should successfully register a new user")
    void registerUser_WhenEmailNotExists_ShouldReturnSavedUser() {
        // ARRANGE: Set up the test scenario
        // Mock that email doesn't exist (empty Optional)
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());
        // Mock password encoding
        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        // Mock saving the user
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // ACT: Execute the method we're testing
        User result = userService.registerUser(testUser);
        
        // ASSERT: Verify the results
        assertNotNull(result, "Result should not be null");
        assertEquals(testUser.getEmail(), result.getEmail(), "Email should match");
        assertEquals(testUser.getNom(), result.getNom(), "Name should match");
        assertEquals("LOCATAIRE", result.getRole(), "Default role should be LOCATAIRE");
        
        // Verify that the password was encoded
        verify(passwordEncoder, times(1)).encode("plainPassword");
        // Verify that the user was saved
        verify(userRepository, times(1)).save(any(User.class));
    }

    /**
     * Test Case 2: Registration fails when email already exists
     * This tests error handling - when business rules are violated
     */
    @Test
    @DisplayName("Should throw BadRequestException when email already exists")
    void registerUser_WhenEmailExists_ShouldThrowBadRequestException() {
        // ARRANGE: Set up the scenario where email already exists
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(existingUser));
        
        // ACT & ASSERT: Execute and verify exception is thrown
        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> userService.registerUser(testUser),
            "Should throw BadRequestException when email exists"
        );
        
        assertEquals("Email is already in use", exception.getMessage());
        
        // Verify that save was never called since validation failed
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    /**
     * Test Case 3: Setting default role when none provided
     * This tests default value logic
     */
    @Test
    @DisplayName("Should set default role to LOCATAIRE when role is null")
    void registerUser_WhenRoleIsNull_ShouldSetDefaultRole() {
        // ARRANGE
        testUser.setRole(null); // Set role to null
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // ACT
        User result = userService.registerUser(testUser);
        
        // ASSERT
        assertEquals("LOCATAIRE", result.getRole(), "Default role should be set to LOCATAIRE");
    }

    /**
     * Test Case 4: Successfully finding a user by ID
     */
    @Test
    @DisplayName("Should return user when found by ID")
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // ARRANGE
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        // ACT
        User result = userService.getUserById(1L);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    /**
     * Test Case 5: Exception when user not found by ID
     */
    @Test
    @DisplayName("Should throw ResourceNotFoundException when user not found by ID")
    void getUserById_WhenUserNotFound_ShouldThrowResourceNotFoundException() {
        // ARRANGE
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // ACT & ASSERT
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.getUserById(999L)
        );
        
        assertTrue(exception.getMessage().contains("User"));
        assertTrue(exception.getMessage().contains("999"));
    }

    /**
     * Test Case 6: Getting all users
     */
    @Test
    @DisplayName("Should return all users")
    void getAllUsers_ShouldReturnAllUsers() {
        // ARRANGE
        List<User> userList = Arrays.asList(testUser, existingUser);
        when(userRepository.findAll()).thenReturn(userList);
        
        // ACT
        List<User> result = userService.getAllUsers();
        
        // ASSERT
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(testUser));
        assertTrue(result.contains(existingUser));
        verify(userRepository, times(1)).findAll();
    }

    /**
     * Test Case 7: Checking if email exists
     */
    @Test
    @DisplayName("Should return true when email exists")
    void existsByEmail_WhenEmailExists_ShouldReturnTrue() {
        // ARRANGE
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(testUser));
        
        // ACT
        boolean result = userService.existsByEmail("existing@example.com");
        
        // ASSERT
        assertTrue(result);
        verify(userRepository, times(1)).findByEmail("existing@example.com");
    }

    /**
     * Test Case 8: Email doesn't exist
     */
    @Test
    @DisplayName("Should return false when email doesn't exist")
    void existsByEmail_WhenEmailNotExists_ShouldReturnFalse() {
        // ARRANGE
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        
        // ACT
        boolean result = userService.existsByEmail("nonexistent@example.com");
        
        // ASSERT
        assertFalse(result);
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    /**
     * Test Case 9: Successful user deletion
     */
    @Test
    @DisplayName("Should successfully delete user when user exists")
    void deleteUser_WhenUserExists_ShouldDeleteUser() {
        // ARRANGE
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);
        
        // ACT
        assertDoesNotThrow(() -> userService.deleteUser(1L));
        
        // ASSERT
        verify(userRepository, times(1)).existsById(1L);
        verify(userRepository, times(1)).deleteById(1L);
    }

    /**
     * Test Case 10: Deletion fails when user doesn't exist
     */
    @Test
    @DisplayName("Should throw ResourceNotFoundException when trying to delete non-existent user")
    void deleteUser_WhenUserNotExists_ShouldThrowResourceNotFoundException() {
        // ARRANGE
        when(userRepository.existsById(999L)).thenReturn(false);
        
        // ACT & ASSERT
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.deleteUser(999L)
        );
        
        assertTrue(exception.getMessage().contains("User"));
        verify(userRepository, times(1)).existsById(999L);
        verify(userRepository, never()).deleteById(anyLong());
    }
}