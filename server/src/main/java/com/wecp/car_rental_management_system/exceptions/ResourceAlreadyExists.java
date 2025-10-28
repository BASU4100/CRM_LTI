package com.wecp.car_rental_management_system.exceptions;

public class ResourceAlreadyExists extends RuntimeException {
    public ResourceAlreadyExists(String msg) {
        super(msg);
    }
}