package com.wecp.car_rental_management_system.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// global level error handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<String> handleResourceAlreadyExists(ResourceAlreadyExistsException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.ALREADY_REPORTED);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
}
