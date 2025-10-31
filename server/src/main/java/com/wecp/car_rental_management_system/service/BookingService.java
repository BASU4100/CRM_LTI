// package com.wecp.car_rental_management_system.service;

// import com.wecp.car_rental_management_system.entity.Booking;
// import com.wecp.car_rental_management_system.entity.Car;
// import com.wecp.car_rental_management_system.entity.User;
// import com.wecp.car_rental_management_system.exceptions.ResourceNotFoundException;
// import com.wecp.car_rental_management_system.repository.BookingRepository;
// import com.wecp.car_rental_management_system.repository.CarRepository;
// import com.wecp.car_rental_management_system.repository.UserRepository;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.Date;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class BookingService{
//     // implement booking service

//     @Autowired
//     private BookingRepository bookingRepository;

//     @Autowired
//     private CarRepository carRepository;

//     @Autowired
//     private UserRepository userRepository;

//     //get all bookings in the system.
//     public List<Booking> getAllBookings(){
//         return bookingRepository.findAll();
//     }
//     //update the status of a booking.
//     public Booking updateBookingStatus(Long bookingId, String status){
//         // Booking booking = bookingRepository.findById(bookingId).get();
//         // if(Optional.of(booking).isPresent()){
            
//         //     booking.setStatus(status);
//         //     return bookingRepository.save(booking);
//         // }else{
//         //     throw new RuntimeException("Booking not found with ID: "+bookingId);
//         // }
//         Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
//         booking.setStatus(status);
//         return bookingRepository.save(booking);
//     }

//     // book a car for a user between rentalStartDate and rentalEndDate.
//     public Booking bookCar(Long userId , Long carId, Date rentalStartDate, Date rentalEndDate){
//         Optional<User> user = userRepository.findById(userId);
//         Optional<Car> car = carRepository.findById(carId);
//         if(user.isPresent() && car.isPresent()){
//             Booking booking = new Booking();
//             booking.setUser(user.get());
//             booking.setCar(car.get());
//             booking.setRentalEndDate(rentalEndDate);
//             booking.setRentalStartDate(rentalStartDate);
//             booking.setStatus("pending");
//             booking.setPaymentStatus("unpaid");

//             long durationInDays = (rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24);
//             double totalAmount =  durationInDays * car.get().getRentalRatePerDay();
//             booking.setTotalAmount(totalAmount);

//             // car.setStatus("booked");
//             // carRepository.save(car);

//             return bookingRepository.save(booking);
//         }else{
//             throw new RuntimeException("User or Car not found");
//         }
        
//     }

// }
package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.exceptions.ResourceNotFoundException;
import com.wecp.car_rental_management_system.repository.BookingRepository;
import com.wecp.car_rental_management_system.repository.CarRepository;
import com.wecp.car_rental_management_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all bookings (for Agent & Admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Update booking status (Agent only)
    @Transactional
    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // Book a car with full validation
    @Transactional
    public Booking bookCar(Long userId, Long carId, Date rentalStartDate, Date rentalEndDate) {
        // Validate inputs
        if (rentalStartDate == null || rentalEndDate == null) {
            throw new IllegalArgumentException("Rental start and end dates are required.");
        }
        if (rentalEndDate.before(rentalStartDate)) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        // Fetch User and Car
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with ID: " + carId));

        // 1. Check if car is available
        if (!"available".equalsIgnoreCase(car.getStatus())) {
            throw new IllegalStateException("Car is not available for booking. Current status: " + car.getStatus());
        }

        // 2. Check for overlapping bookings
        boolean hasOverlap = bookingRepository.existsByCarAndDateOverlap(
                car, rentalStartDate, rentalEndDate);

        if (hasOverlap) {
            throw new IllegalStateException("Car is already booked for the selected dates.");
        }

        // 3. Calculate total amount
        long durationInMillis = rentalEndDate.getTime() - rentalStartDate.getTime();
        long durationInDays = durationInMillis / (1000 * 60 * 60 * 24);
        if (durationInDays <= 0) {
            throw new IllegalArgumentException("Rental duration must be at least 1 day.");
        }

        double totalAmount = durationInDays * car.getRentalRatePerDay();

        // 4. Create Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCar(car);
        booking.setRentalStartDate(rentalStartDate);
        booking.setRentalEndDate(rentalEndDate);
        booking.setStatus("confirmed");        // Customer books → confirmed
        booking.setPaymentStatus("pending");   // Agent will create payment
        booking.setTotalAmount(totalAmount);

        // 5. Update Car Status to "booked"
        car.setStatus("booked");
        carRepository.save(car);  // This updates the `cars` table

        // 6. Save and return booking
        return bookingRepository.save(booking);
    }
}