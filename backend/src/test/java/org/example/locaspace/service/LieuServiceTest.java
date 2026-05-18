package org.example.locaspace.service;

import org.example.locaspace.model.Lieu;
import org.example.locaspace.model.User;
import org.example.locaspace.model.enums.LieuType;
import org.example.locaspace.repository.AvisRepository;
import org.example.locaspace.repository.LieuRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("LieuService Unit Tests")
class LieuServiceTest {

    @Mock
    private LieuRepository lieuRepository;

    @Mock
    private AvisRepository avisRepository;

    @InjectMocks
    private LieuService lieuService;

    @Test
    void createLieu_shouldForceValidatedTrue() {
        Lieu lieu = new Lieu();
        lieu.setTitre("Nice Place");
        lieu.setType(LieuType.APPARTEMENT);
        lieu.setPrix(new BigDecimal("120.00"));
        lieu.setValide(false);

        when(lieuRepository.save(any(Lieu.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Lieu result = lieuService.createLieu(lieu);

        assertTrue(result.isValide());
        verify(lieuRepository).save(lieu);
    }

    @Test
    void getAllValidatedLieux_shouldReturnRepositoryPage() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<Lieu> expected = new PageImpl<>(List.of(new Lieu()));

        when(lieuRepository.findByValideTrue(pageable)).thenReturn(expected);

        Page<Lieu> result = lieuService.getAllValidatedLieux(pageable);

        assertEquals(1, result.getTotalElements());
        verify(lieuRepository).findByValideTrue(pageable);
    }

    @Test
    void deleteLieu_shouldAllowOnlyOwner() {
        User owner = new User();
        owner.setId(1L);

        User other = new User();
        other.setId(2L);

        Lieu lieu = new Lieu();
        lieu.setId(10L);
        lieu.setOwner(owner);

        when(lieuRepository.findById(10L)).thenReturn(Optional.of(lieu));

        boolean deletedByOther = lieuService.deleteLieu(10L, other);
        boolean deletedByOwner = lieuService.deleteLieu(10L, owner);

        assertFalse(deletedByOther);
        assertTrue(deletedByOwner);
        verify(lieuRepository, times(1)).delete(lieu);
    }
}
