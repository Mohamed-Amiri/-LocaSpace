package org.example.locaspace.dto.error;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> validationErrors;

    public ValidationErrorResponse(int status, String error, String message, String path, 
                                 LocalDateTime timestamp, Map<String, String> validationErrors) {
        super(status, error, message, path, timestamp);
        this.validationErrors = validationErrors;
    }
}
