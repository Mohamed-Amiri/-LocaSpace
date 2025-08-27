package org.example.locaspace.service;

import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.AvisRepository;
import org.example.locaspace.repository.LieuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Simple unit tests for LieuService
 * 
 * This demonstrates:
 * 1. Testing CRUD operations
 * 2. Testing business logic (validation rules)
 * 3. Testing search functionality
 * 4. Testing authorization logic
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("LieuService Simple Tests")
class LieuServiceTest {

    @Mock
    private LieuRepository lieuRepository;
    
    @Mock
    private AvisRepository avisRepository;
    
    @InjectMocks
    private LieuService lieuService;
    
    private Lieu testLieu;
    private User testOwner;
    private User testAdmin;
    
    @BeforeEach
    void setUp() {
        // Create test owner
        testOwner = new User();
        testOwner.setId(1L);
        testOwner.setNom("Test Owner");
        testOwner.setEmail("owner@example.com");
        testOwner.setRole("PROPRIETAIRE");
        
        // Create test admin
        testAdmin = new User();
        testAdmin.setId(2L);
        testAdmin.setNom("Test Admin");
        testAdmin.setEmail("admin@example.com");
        testAdmin.setRole("ADMIN");
        
        // Create test lieu
        testLieu = new Lieu();
        testLieu.setId(1L);
        testLieu.setTitre("Test Apartment");
        testLieu.setDescription("A nice test apartment");
        testLieu.setType("APARTMENT");
        testLieu.setPrix(new BigDecimal("100.00"));
        testLieu.setAdresse("123 Test Street, Paris");
        testLieu.setOwner(testOwner);
        testLieu.setValide(false);
    }

    @Test
    @DisplayName("Should create lieu with validation set to false")
    void createLieu_ShouldSetValidationToFalse() {
        // ARRANGE
        testLieu.setValide(true); // Set to true initially
        when(lieuRepository.save(any(Lieu.class))).thenReturn(testLieu);
        
        // ACT
        Lieu result = lieuService.createLieu(testLieu);
        
        // ASSERT
        assertNotNull(result);
        assertFalse(result.isValide(), "New lieu should not be validated by default");
        verify(lieuRepository, times(1)).save(testLieu);
    }

    @Test
    @DisplayName("Should return only validated lieux")
    void getAllValidatedLieux_ShouldReturnOnlyValidated() {
        // ARRANGE
        Lieu validatedLieu = new Lieu();
        validatedLieu.setId(2L);
        validatedLieu.setValide(true);
        
        List<Lieu> validatedLieux = Arrays.asList(validatedLieu);
        when(lieuRepository.findByValideTrue()).thenReturn(validatedLieux);
        
        // ACT
        List<Lieu> result = lieuService.getAllValidatedLieux();
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).isValide());
        verify(lieuRepository, times(1)).findByValideTrue();
    }

    @Test
    @DisplayName("Should find lieu by ID")
    void getLieuById_WhenLieuExists_ShouldReturnLieu() {
        // ARRANGE
        when(lieuRepository.findById(1L)).thenReturn(Optional.of(testLieu));
        
        // ACT
        Optional<Lieu> result = lieuService.getLieuById(1L);
        
        // ASSERT
        assertTrue(result.isPresent());
        assertEquals(testLieu.getId(), result.get().getId());
        assertEquals(testLieu.getTitre(), result.get().getTitre());
        verify(lieuRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when lieu not found")
    void getLieuById_WhenLieuNotExists_ShouldReturnEmpty() {
        // ARRANGE
        when(lieuRepository.findById(999L)).thenReturn(Optional.empty());
        
        // ACT
        Optional<Lieu> result = lieuService.getLieuById(999L);
        
        // ASSERT
        assertFalse(result.isPresent());
        verify(lieuRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should validate lieu when admin validates")
    void validateLieu_WhenLieuExists_ShouldSetValidToTrue() {
        // ARRANGE
        when(lieuRepository.findById(1L)).thenReturn(Optional.of(testLieu));
        when(lieuRepository.save(any(Lieu.class))).thenReturn(testLieu);
        
        // ACT
        boolean result = lieuService.validateLieu(1L);
        
        // ASSERT
        assertTrue(result);
        assertTrue(testLieu.isValide());
        verify(lieuRepository, times(1)).findById(1L);
        verify(lieuRepository, times(1)).save(testLieu);
    }

    @Test
    @DisplayName("Should return false when validating non-existent lieu")
    void validateLieu_WhenLieuNotExists_ShouldReturnFalse() {
        // ARRANGE
        when(lieuRepository.findById(999L)).thenReturn(Optional.empty());
        
        // ACT
        boolean result = lieuService.validateLieu(999L);
        
        // ASSERT
        assertFalse(result);
        verify(lieuRepository, times(1)).findById(999L);
        verify(lieuRepository, never()).save(any(Lieu.class));
    }

    @Test
    @DisplayName("Should allow owner to delete their lieu")
    void deleteLieu_WhenUserIsOwner_ShouldReturnTrue() {
        // ARRANGE
        when(lieuRepository.findById(1L)).thenReturn(Optional.of(testLieu));
        doNothing().when(lieuRepository).delete(testLieu);
        
        // ACT
        boolean result = lieuService.deleteLieu(1L, testOwner);
        
        // ASSERT
        assertTrue(result);
        verify(lieuRepository, times(1)).findById(1L);
        verify(lieuRepository, times(1)).delete(testLieu);
    }

    @Test
    @DisplayName("Should allow admin to delete any lieu")
    void deleteLieu_WhenUserIsAdmin_ShouldReturnTrue() {
        // ARRANGE
        when(lieuRepository.findById(1L)).thenReturn(Optional.of(testLieu));
        doNothing().when(lieuRepository).delete(testLieu);
        
        // ACT
        boolean result = lieuService.deleteLieu(1L, testAdmin);
        
        // ASSERT
        assertTrue(result);
        verify(lieuRepository, times(1)).findById(1L);
        verify(lieuRepository, times(1)).delete(testLieu);
    }

    @Test
    @DisplayName("Should not allow non-owner/non-admin to delete lieu")
    void deleteLieu_WhenUserNotOwnerOrAdmin_ShouldReturnFalse() {
        // ARRANGE
        User unauthorizedUser = new User();
        unauthorizedUser.setId(999L);
        unauthorizedUser.setRole("LOCATAIRE");
        
        when(lieuRepository.findById(1L)).thenReturn(Optional.of(testLieu));
        
        // ACT
        boolean result = lieuService.deleteLieu(1L, unauthorizedUser);
        
        // ASSERT
        assertFalse(result);
        verify(lieuRepository, times(1)).findById(1L);
        verify(lieuRepository, never()).delete(any(Lieu.class));
    }

    @Test
    @DisplayName("Should search lieux by keyword")
    void searchLieux_WithKeyword_ShouldCallRepositorySearch() {
        // ARRANGE
        String keyword = "apartment";
        List<Lieu> searchResults = Arrays.asList(testLieu);
        when(lieuRepository.searchByKeyword(keyword)).thenReturn(searchResults);
        
        // ACT
        List<Lieu> result = lieuService.searchLieux(keyword);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testLieu.getId(), result.get(0).getId());
        verify(lieuRepository, times(1)).searchByKeyword(keyword);
    }

    @Test
    @DisplayName("Should return all validated lieux when keyword is empty")
    void searchLieux_WithEmptyKeyword_ShouldReturnAllValidated() {
        // ARRANGE
        List<Lieu> allValidated = Arrays.asList(testLieu);
        when(lieuRepository.findByValideTrue()).thenReturn(allValidated);
        
        // ACT
        List<Lieu> result = lieuService.searchLieux("");
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(lieuRepository, times(1)).findByValideTrue();
        verify(lieuRepository, never()).searchByKeyword(anyString());
    }

    @Test
    @DisplayName("Should filter lieux by type")
    void getLieuxByType_ShouldCallRepositoryWithCorrectType() {
        // ARRANGE
        String type = "APARTMENT";
        List<Lieu> typeResults = Arrays.asList(testLieu);
        when(lieuRepository.findByType(type)).thenReturn(typeResults);
        
        // ACT
        List<Lieu> result = lieuService.getLieuxByType(type);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(type, result.get(0).getType());
        verify(lieuRepository, times(1)).findByType(type);
    }

    @Test
    @DisplayName("Should filter lieux by city")
    void getLieuxByCity_ShouldCallRepositoryWithCity() {
        // ARRANGE
        String city = "Paris";
        List<Lieu> cityResults = Arrays.asList(testLieu);
        when(lieuRepository.findByAdresseContainingIgnoreCase(city)).thenReturn(cityResults);
        
        // ACT
        List<Lieu> result = lieuService.getLieuxByCity(city);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getAdresse().contains(city));
        verify(lieuRepository, times(1)).findByAdresseContainingIgnoreCase(city);
    }

    @Test
    @DisplayName("Should get unvalidated lieux for admin")
    void getUnvalidatedLieux_ShouldReturnUnvalidatedOnly() {
        // ARRANGE
        List<Lieu> unvalidatedLieux = Arrays.asList(testLieu);
        when(lieuRepository.findByValideFalse()).thenReturn(unvalidatedLieux);
        
        // ACT
        List<Lieu> result = lieuService.getUnvalidatedLieux();
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertFalse(result.get(0).isValide());
        verify(lieuRepository, times(1)).findByValideFalse();
    }

    @Test
    @DisplayName("Should get lieux by owner")
    void getLieuxByOwner_ShouldReturnOwnerLieux() {
        // ARRANGE
        List<Lieu> ownerLieux = Arrays.asList(testLieu);
        when(lieuRepository.findByOwner(testOwner)).thenReturn(ownerLieux);
        
        // ACT
        List<Lieu> result = lieuService.getLieuxByOwner(testOwner);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testOwner.getId(), result.get(0).getOwner().getId());
        verify(lieuRepository, times(1)).findByOwner(testOwner);
    }
}