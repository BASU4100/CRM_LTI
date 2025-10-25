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

@RestController
public class AdministratorController {
    @Autowired
    private CarCategoryService carCategoryService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/administrator/car-categories")
    public ResponseEntity<CarCategory> createCarCategory(@RequestBody CarCategory carCategory) {
        // create car category
        return new ResponseEntity<CarCategory>(carCategoryService.createCarCategory(carCategory), HttpStatus.CREATED);
    }

    @GetMapping("/api/administrator/car-categories")
    public ResponseEntity<List<CarCategory>> getAllCarCategories() {
        // get all car categories
        return new ResponseEntity<>(carCategoryService.getAllCarCategories(),HttpStatus.OK);
    }

    @PutMapping("/api/administrator/car-categories/{categoryId}")
    public ResponseEntity<CarCategory> updateCarCategory(@PathVariable Long categoryId, @RequestBody CarCategory updatedCarCategory) {
      // update car category
      return new ResponseEntity<CarCategory>(carCategoryService.updateCarCategory(categoryId, updatedCarCategory), HttpStatus.OK);
    }

    @GetMapping("/api/administrator/reports/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        // get all bookings
        return new ResponseEntity<>(bookingService.getAllBookings(),HttpStatus.OK);
    }

    @GetMapping("/api/administrator/reports/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
       // get all payments
       return new ResponseEntity<>(paymentService.getAllPayments(),HttpStatus.OK);
    }
}
