package com.wecp.car_rental_management_system.exceptions;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String msg) {
        super(msg);
    }
}
