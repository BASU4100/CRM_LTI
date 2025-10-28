package com.wecp.car_rental_management_system.exceptions;

public class ResourceNotFound extends RuntimeException{
    public ResourceNotFound(String msg) {
        super(msg);
    }
}
