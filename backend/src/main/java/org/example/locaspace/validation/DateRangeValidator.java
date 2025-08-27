package org.example.locaspace.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.locaspace.dto.reservation.ReservationRequest;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, ReservationRequest> {
    
    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        // Initialization logic if needed
    }
    
    @Override
    public boolean isValid(ReservationRequest request, ConstraintValidatorContext context) {
        if (request == null || request.getDateDebut() == null || request.getDateFin() == null) {
            return true; // Let @NotNull handle null values
        }
        
        return request.getDateDebut().isBefore(request.getDateFin());
    }
}