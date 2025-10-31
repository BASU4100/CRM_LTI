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
    private final CarCategoryService carCategoryService;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    // dependency injection
    @Autowired
    public AdministratorController(CarCategoryService carCategoryService, BookingService bookingService,
            PaymentService paymentService) {
        this.carCategoryService = carCategoryService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    // create car category
    @PostMapping("/api/administrator/car-categories")
    public ResponseEntity<CarCategory> createCarCategory(@RequestBody CarCategory carCategory) {
        return new ResponseEntity<CarCategory>(carCategoryService.createCarCategory(carCategory), HttpStatus.CREATED);
    }

    // get all car categories
    @GetMapping("/api/administrator/car-categories")
    public ResponseEntity<List<CarCategory>> getAllCarCategories() {
        return new ResponseEntity<>(carCategoryService.getAllCarCategories(), HttpStatus.OK);
    }

    // update car category
    @PutMapping("/api/administrator/car-categories/{categoryId}")
    public ResponseEntity<CarCategory> updateCarCategory(@PathVariable Long categoryId,
            @RequestBody CarCategory updatedCarCategory) {
        return new ResponseEntity<CarCategory>(carCategoryService.updateCarCategory(categoryId, updatedCarCategory),
                HttpStatus.OK);
    }

    // get all bookings
    @GetMapping("/api/administrator/reports/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return new ResponseEntity<>(bookingService.getAllBookings(), HttpStatus.OK);
    }

    // get all payments
    @GetMapping("/api/administrator/reports/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return new ResponseEntity<>(paymentService.getAllPayments(), HttpStatus.OK);
    }
}