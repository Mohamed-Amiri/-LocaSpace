package org.example.locaspace.repository;

import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.Reservation;
import org.example.locaspace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByLocataire(User locataire);
    
    List<Reservation> findByLieu(Lieu lieu);
    
    List<Reservation> findByStatut(String statut);
    
    @Query("SELECT r FROM Reservation r WHERE r.lieu.owner = :owner")
    List<Reservation> findByLieuOwner(@Param("owner") User owner);
    
    @Query("SELECT r FROM Reservation r WHERE r.lieu = :lieu AND r.statut IN ('EN_ATTENTE','CONFIRMEE') AND " +
           "((r.dateDebut BETWEEN :dateDebut AND :dateFin) OR " +
           "(r.dateFin BETWEEN :dateDebut AND :dateFin) OR " +
           "(r.dateDebut <= :dateDebut AND r.dateFin >= :dateFin))")
    List<Reservation> findConflictingReservations(@Param("lieu") Lieu lieu,
                                                 @Param("dateDebut") LocalDate dateDebut,
                                                 @Param("dateFin") LocalDate dateFin);
    
    @Query("SELECT r FROM Reservation r WHERE r.locataire = :locataire AND r.statut = :statut")
    List<Reservation> findByLocataireAndStatut(@Param("locataire") User locataire, @Param("statut") String statut);
    
    @Query("SELECT r FROM Reservation r WHERE r.lieu = :lieu AND r.statut = 'CONFIRMEE' AND r.dateFin < :today")
    List<Reservation> findPastReservations(@Param("lieu") Lieu lieu, @Param("today") LocalDate today);
    
    @Query("SELECT r FROM Reservation r WHERE r.lieu = :lieu AND r.statut = 'CONFIRMEE' AND r.dateDebut > :today")
    List<Reservation> findFutureReservations(@Param("lieu") Lieu lieu, @Param("today") LocalDate today);
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.locataire = :locataire")
    Long countByLocataire(@Param("locataire") User locataire);
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.lieu.owner = :owner")
    Long countByLieuOwner(@Param("owner") User owner);
}
