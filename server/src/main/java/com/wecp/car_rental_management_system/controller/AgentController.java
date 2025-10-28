package com.wecp.car_rental_management_system.controller;


import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.Payment;
import com.wecp.car_rental_management_system.service.BookingService;
import com.wecp.car_rental_management_system.service.CarService;
import com.wecp.car_rental_management_system.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AgentController {

    private final CarService carService;
    private final BookingService bookingService;
    private final PaymentService paymentService;

    @Autowired
    public AgentController(CarService carService, BookingService bookingService, PaymentService paymentService) {
        this.carService = carService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    @PostMapping("/api/agent/car")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        // add a car and return created car
        car = carService.addCar(car);
        if (car==null) {
            return new ResponseEntity<>(HttpStatus.IM_USED);
        }
        return new ResponseEntity<Car>(car, HttpStatus.CREATED);
    }

    @GetMapping("/api/agent/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        // get all cars
        List<Car> obj = carService.getAllCars();
        return new ResponseEntity<>(obj, HttpStatus.OK);

    }

    @PutMapping("/api/agent/car/{carId}")
    public ResponseEntity<Car> updateCar(@PathVariable Long carId, @RequestBody Car updatedCar) {
        // update a car
        Car car = carService.updateCar(carId, updatedCar);
        return new ResponseEntity<>(car,HttpStatus.OK);
    }

    @GetMapping("/api/agent/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        // get all bookings
        List<Booking> obj = bookingService.getAllBookings();
        return new ResponseEntity<>(obj,HttpStatus.OK);
    }

    @PutMapping("/api/agent/bookings/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
       // update booking status
       Booking obj = bookingService.updateBookingStatus(bookingId,status);
       return new ResponseEntity<>(obj,HttpStatus.OK);
    }

    @PostMapping("/api/agent/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(@PathVariable Long bookingId,
                                                   @RequestBody Payment paymentRequest) {
        // create payment of a booking
        Payment payment = paymentService.generateInvoice(bookingId, paymentRequest);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }
}

