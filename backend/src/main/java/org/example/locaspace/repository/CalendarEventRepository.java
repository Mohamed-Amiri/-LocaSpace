package org.example.locaspace.repository;

import org.example.locaspace.model.CalendarEvent;
import org.example.locaspace.model.Lieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    @Query("SELECT e FROM CalendarEvent e WHERE e.lieu = :lieu AND " +
           "((e.startDate BETWEEN :start AND :end) OR " +
           "(e.endDate BETWEEN :start AND :end) OR " +
           "(e.startDate <= :start AND e.endDate >= :end))")
    List<CalendarEvent> findInRange(@Param("lieu") Lieu lieu,
                                    @Param("start") LocalDate start,
                                    @Param("end") LocalDate end);
}





