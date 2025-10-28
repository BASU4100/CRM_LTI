package com.wecp.car_rental_management_system.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// global level error handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<String> handleResourceAlreadyExists(ResourceAlreadyExists e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.ALREADY_REPORTED);
    }
    
    @ExceptionHandler(ResourceNotFound.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFound e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
}
