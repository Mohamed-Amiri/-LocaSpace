package org.example.locaspace.service;

import org.example.locaspace.model.Avis;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.User;
import org.example.locaspace.repository.AvisRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Very Simple unit tests for AvisService
 * 
 * This is the simplest example showing:
 * 1. Basic CRUD testing
 * 2. Simple assertions
 * 3. Basic mocking patterns
 * 
 * Perfect for beginners to understand unit testing!
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AvisService Basic Tests")
class AvisServiceTest {

    @Mock
    private AvisRepository avisRepository;
    
    @InjectMocks
    private AvisService avisService;
    
    private Avis testAvis;
    private User testUser;
    private Lieu testLieu;
    
    @BeforeEach
    void setUp() {
        // Simple test data setup
        testUser = new User();
        testUser.setId(1L);
        testUser.setNom("Test User");
        
        testLieu = new Lieu();
        testLieu.setId(1L);
        testLieu.setTitre("Test Place");
        
        testAvis = new Avis();
        testAvis.setId(1L);
        testAvis.setNote(5);
        testAvis.setCommentaire("Great place!");
        testAvis.setAuteur(testUser);
        testAvis.setLieu(testLieu);
    }

    /**
     * Test 1: Creating a review
     * This is the most basic test - save and return
     */
    @Test
    @DisplayName("Should create and save a new review")
    void createAvis_ShouldSaveAndReturnAvis() {
        // ARRANGE: Tell the mock what to return
        when(avisRepository.save(testAvis)).thenReturn(testAvis);
        
        // ACT: Call the method we're testing
        Avis result = avisService.createAvis(testAvis);
        
        // ASSERT: Check the results
        assertNotNull(result);
        assertEquals(testAvis.getId(), result.getId());
        assertEquals(testAvis.getNote(), result.getNote());
        assertEquals(testAvis.getCommentaire(), result.getCommentaire());
        
        // Verify the repository was called
        verify(avisRepository, times(1)).save(testAvis);
    }

    /**
     * Test 2: Finding a review by ID - Success case
     */
    @Test
    @DisplayName("Should find review by ID when it exists")
    void getAvisById_WhenExists_ShouldReturnAvis() {
        // ARRANGE
        when(avisRepository.findById(1L)).thenReturn(Optional.of(testAvis));
        
        // ACT
        Optional<Avis> result = avisService.getAvisById(1L);
        
        // ASSERT
        assertTrue(result.isPresent());
        assertEquals(testAvis.getId(), result.get().getId());
        verify(avisRepository, times(1)).findById(1L);
    }

    /**
     * Test 3: Finding a review by ID - Not found case
     */
    @Test
    @DisplayName("Should return empty when review not found")
    void getAvisById_WhenNotExists_ShouldReturnEmpty() {
        // ARRANGE
        when(avisRepository.findById(999L)).thenReturn(Optional.empty());
        
        // ACT
        Optional<Avis> result = avisService.getAvisById(999L);
        
        // ASSERT
        assertFalse(result.isPresent());
        verify(avisRepository, times(1)).findById(999L);
    }

    /**
     * Test 4: Getting reviews for a place
     */
    @Test
    @DisplayName("Should return all reviews for a place")
    void getAvisForLieu_ShouldReturnListOfReviews() {
        // ARRANGE
        List<Avis> expectedReviews = Arrays.asList(testAvis);
        when(avisRepository.findByLieuOrderByIdDesc(testLieu)).thenReturn(expectedReviews);
        
        // ACT
        List<Avis> result = avisService.getAvisForLieu(testLieu);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAvis.getId(), result.get(0).getId());
        verify(avisRepository, times(1)).findByLieuOrderByIdDesc(testLieu);
    }

    /**
     * Test 5: Checking if user has already reviewed a place
     */
    @Test
    @DisplayName("Should return true when user has already reviewed place")
    void hasUserReviewedPlace_WhenReviewExists_ShouldReturnTrue() {
        // ARRANGE
        when(avisRepository.findByAuteurAndLieu(testUser, testLieu)).thenReturn(Optional.of(testAvis));
        
        // ACT
        boolean result = avisService.hasUserReviewedPlace(testUser, testLieu);
        
        // ASSERT
        assertTrue(result);
        verify(avisRepository, times(1)).findByAuteurAndLieu(testUser, testLieu);
    }

    /**
     * Test 6: User hasn't reviewed place yet
     */
    @Test
    @DisplayName("Should return false when user hasn't reviewed place")
    void hasUserReviewedPlace_WhenNoReview_ShouldReturnFalse() {
        // ARRANGE
        when(avisRepository.findByAuteurAndLieu(testUser, testLieu)).thenReturn(Optional.empty());
        
        // ACT
        boolean result = avisService.hasUserReviewedPlace(testUser, testLieu);
        
        // ASSERT
        assertFalse(result);
        verify(avisRepository, times(1)).findByAuteurAndLieu(testUser, testLieu);
    }

    /**
     * Test 7: Getting average rating for a place
     */
    @Test
    @DisplayName("Should return average rating for place")
    void getAverageRatingForLieu_ShouldReturnAverage() {
        // ARRANGE
        Double expectedAverage = 4.5;
        when(avisRepository.findAverageNoteByLieu(testLieu)).thenReturn(expectedAverage);
        
        // ACT
        Double result = avisService.getAverageRatingForLieu(testLieu);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(expectedAverage, result);
        verify(avisRepository, times(1)).findAverageNoteByLieu(testLieu);
    }

    /**
     * Test 8: Getting review count for a place
     */
    @Test
    @DisplayName("Should return review count for place")
    void getReviewCountForLieu_ShouldReturnCount() {
        // ARRANGE
        Long expectedCount = 5L;
        when(avisRepository.countByLieu(testLieu)).thenReturn(expectedCount);
        
        // ACT
        Long result = avisService.getReviewCountForLieu(testLieu);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(expectedCount, result);
        verify(avisRepository, times(1)).countByLieu(testLieu);
    }

    /**
     * Test 9: Deleting a review
     */
    @Test
    @DisplayName("Should delete review by ID")
    void deleteAvis_ShouldCallRepositoryDelete() {
        // ARRANGE
        doNothing().when(avisRepository).deleteById(1L);
        
        // ACT
        assertDoesNotThrow(() -> avisService.deleteAvis(1L));
        
        // ASSERT
        verify(avisRepository, times(1)).deleteById(1L);
    }

    /**
     * Test 10: Getting reviews by user
     */
    @Test
    @DisplayName("Should return all reviews by user")
    void getAvisByUser_ShouldReturnUserReviews() {
        // ARRANGE
        List<Avis> userReviews = Arrays.asList(testAvis);
        when(avisRepository.findByAuteur(testUser)).thenReturn(userReviews);
        
        // ACT
        List<Avis> result = avisService.getAvisByUser(testUser);
        
        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getId(), result.get(0).getAuteur().getId());
        verify(avisRepository, times(1)).findByAuteur(testUser);
    }
}