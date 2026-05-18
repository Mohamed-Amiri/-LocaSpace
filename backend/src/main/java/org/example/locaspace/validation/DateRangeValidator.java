package org.example.locaspace.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.locaspace.dto.reservation.ReservationRequest;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, ReservationRequest> {

    @Override
    public void initialize(ValidDateRange constraintAnnotation) {
        // No initialization required
    }

    @Override
    public boolean isValid(ReservationRequest request, ConstraintValidatorContext context) {
        if (request == null || request.getStartDate() == null || request.getEndDate() == null) {
            return true; // Let @NotNull handle null values
        }

        return request.getStartDate().isBefore(request.getEndDate());
    }
}
