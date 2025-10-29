package com.wecp.car_rental_management_system.exceptions;

public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String msg) {
        super(msg);
    }
}