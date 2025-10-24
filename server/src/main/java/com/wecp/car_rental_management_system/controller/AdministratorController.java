package com.wecp.car_rental_management_system.controller;


import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.entity.Payment;
import com.wecp.car_rental_management_system.service.BookingService;
import com.wecp.car_rental_management_system.service.CarCategoryService;
import com.wecp.car_rental_management_system.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


public class AdministratorController {


    @PostMapping("/api/administrator/car-categories")
    public ResponseEntity<CarCategory> createCarCategory(@RequestBody CarCategory carCategory) {
        // create car category
    }

    @GetMapping("/api/administrator/car-categories")
    public ResponseEntity<List<CarCategory>> getAllCarCategories() {
        // get all car categories
    }

    @PutMapping("/api/administrator/car-categories/{categoryId}")
    public ResponseEntity<CarCategory> updateCarCategory(@PathVariable Long categoryId, @RequestBody CarCategory updatedCarCategory) {
      // update car category
    }

    @GetMapping("/api/administrator/reports/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        // get all bookings
    }

    @GetMapping("/api/administrator/reports/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
       // get all payments
    }
}
