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

    // dependency injection
    @Autowired
    public AgentController(CarService carService, BookingService bookingService, PaymentService paymentService) {
        this.carService = carService;
        this.bookingService = bookingService;
        this.paymentService = paymentService;
    }

    // add a car and return created car
    @PostMapping("/api/agent/car")
    public ResponseEntity<Car> addCar(@RequestBody Car car) {
        // car = carService.addCar(car);
        // if (car==null) {
        // return new ResponseEntity<>(HttpStatus.IM_USED);
        // }
        return new ResponseEntity<Car>(carService.addCar(car), HttpStatus.CREATED);
    }

    // get all cars
    @GetMapping("/api/agent/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carService.getAllCars();
        return new ResponseEntity<>(cars, HttpStatus.OK);
    }

    // update a car
    @PutMapping("/api/agent/car/{carId}")
    public ResponseEntity<Car> updateCar(@PathVariable Long carId, @RequestBody Car updatedCar) {
        return new ResponseEntity<>(carService.updateCar(carId, updatedCar), HttpStatus.OK);
    }

    // get all bookings
    @GetMapping("/api/agent/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return new ResponseEntity<>(bookingService.getAllBookings(), HttpStatus.OK);
    }

    // update booking status
    @PutMapping("/api/agent/bookings/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
        return new ResponseEntity<>(bookingService.updateBookingStatus(bookingId, status), HttpStatus.OK);
    }

    // create payment of a booking
    @PostMapping("/api/agent/payment/{bookingId}")
    public ResponseEntity<Payment> createPayment(@PathVariable Long bookingId, @RequestBody Payment paymentRequest) {
        return new ResponseEntity<>(paymentService.generateInvoice(bookingId, paymentRequest), HttpStatus.CREATED);
    }
}
