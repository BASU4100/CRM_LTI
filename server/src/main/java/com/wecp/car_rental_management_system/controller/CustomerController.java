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

// import java.time.LocalDateTime;
import java.util.List;
// import java.util.Optional;

@RestController
public class CustomerController {
    private final CarService carService;
    private final BookingService bookingService;

    @Autowired
    public CustomerController(CarService carService, BookingService bookingService) {
        this.carService = carService;
        this.bookingService = bookingService;
    }

    // get all available cars.
    // note: return all the cars where car status is "available"
    @GetMapping("/api/customers/cars/available")
    public ResponseEntity<List<Car>> getAvailableCars() {
        return new ResponseEntity<List<Car>>(carService.getAvailableCars(),HttpStatus.OK);
    }

    // book a car
    @PostMapping("/api/customers/booking")
    public ResponseEntity<Booking> bookCar(@RequestParam Long userId, @RequestParam Long carId,
                                           @RequestBody BookingDto bookingDto) {
        return new ResponseEntity<Booking>(bookingService.bookCar(userId, carId, bookingDto.getRentalStartDate(), bookingDto.getRentalEndDate()),HttpStatus.CREATED);
    }

}
