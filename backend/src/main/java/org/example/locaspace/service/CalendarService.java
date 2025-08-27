package org.example.locaspace.service;

import org.example.locaspace.model.CalendarEvent;
import org.example.locaspace.model.Lieu;
import org.example.locaspace.repository.CalendarEventRepository;
import org.example.locaspace.repository.LieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class CalendarService {

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    @Autowired
    private LieuRepository lieuRepository;

    public List<CalendarEvent> getEvents(Long lieuId, LocalDate start, LocalDate end) {
        Lieu lieu = lieuRepository.findById(lieuId).orElseThrow();
        return calendarEventRepository.findInRange(lieu, start, end);
    }

    public CalendarEvent blockDates(Long lieuId, LocalDate start, LocalDate end, String title) {
        Lieu lieu = lieuRepository.findById(lieuId).orElseThrow();
        CalendarEvent event = CalendarEvent.builder()
                .lieu(lieu)
                .startDate(start)
                .endDate(end)
                .type("blocked")
                .title(title)
                .build();
        return calendarEventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        calendarEventRepository.deleteById(eventId);
    }
}





