package org.example.locaspace.repository;

import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LieuRepository extends JpaRepository<Lieu, Long> {
    
    List<Lieu> findByValideTrue();
    
    List<Lieu> findByOwner(User owner);
    
    List<Lieu> findByType(String type);
    
    @Query("SELECT l FROM Lieu l WHERE l.valide = true AND l.prix BETWEEN :minPrix AND :maxPrix")
    List<Lieu> findByPrixBetween(@Param("minPrix") BigDecimal minPrix, @Param("maxPrix") BigDecimal maxPrix);
    
    @Query("SELECT l FROM Lieu l WHERE l.valide = true AND LOWER(l.adresse) LIKE LOWER(CONCAT('%', :ville, '%'))")
    List<Lieu> findByAdresseContainingIgnoreCase(@Param("ville") String ville);
    
    @Query("SELECT l FROM Lieu l WHERE l.valide = true AND " +
           "(LOWER(l.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.adresse) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Lieu> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT l FROM Lieu l WHERE l.valide = true AND l.type = :type AND l.prix BETWEEN :minPrix AND :maxPrix")
    List<Lieu> findByTypeAndPrixBetween(@Param("type") String type, 
                                       @Param("minPrix") BigDecimal minPrix, 
                                       @Param("maxPrix") BigDecimal maxPrix);
    
    List<Lieu> findByValideFalse(); // For admin validation
    
    @Query("SELECT COUNT(l) FROM Lieu l WHERE l.owner = :owner")
    Long countByOwner(@Param("owner") User owner);
}
