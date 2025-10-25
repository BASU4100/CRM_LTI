package com.wecp.car_rental_management_system.controller;


import com.wecp.car_rental_management_system.dto.BookingDto;
import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.service.BookingService;
import com.wecp.car_rental_management_system.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public class CustomerController {

    @Autowired
    private CarService carService;

    @Autowired
    private BookingService bookingService;


    @GetMapping("/api/customers/cars/available")
    public ResponseEntity<List<Car>> getAvailableCars() {
        // get all available cars.
        // note: return all the cars where car status is "available"
        return new ResponseEntity<List<Car>>(carService.getAvailableCars(),HttpStatus.OK);

    }

    @PostMapping("/api/customers/booking")
    public ResponseEntity<Booking> bookCar(@RequestParam Long userId, @RequestParam Long carId,
                                           @RequestBody BookingDto bookingDto) {
        // book a car
        return new ResponseEntity<Booking>(bookingService.bookCar(userId,carId, bookingDto.getRentalStartDate(), bookingDto.getRentalEndDate()),HttpStatus.CREATED);
    }

}
