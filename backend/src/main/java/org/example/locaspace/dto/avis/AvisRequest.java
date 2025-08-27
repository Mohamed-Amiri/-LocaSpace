package org.example.locaspace.dto.avis;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AvisRequest {

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer note;

    @NotBlank(message = "Comment is required")
    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    private String commentaire;
}