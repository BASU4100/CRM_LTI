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
import java.util.Optional;

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

    // Book a car
        public Booking bookCar(Long userId, Long carId, Date rentalStartDate, Date rentalEndDate) {
            // Fetch user
            Optional<User> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                throw new RuntimeException("User not found with id: " + userId);
            }
    
            // Fetch car
            Optional<Car> optionalCar = carRepository.findById(carId);
            if (!optionalCar.isPresent()) {
                throw new RuntimeException("Car not found with id: " + carId);
            }
    
            Car car = optionalCar.get();
            // Check if car is available
            if (!"available".equalsIgnoreCase(car.getStatus())) {
                throw new RuntimeException("Car is not available for booking");
            }
    
            // Calculate total amount based on rental duration and car's rental rate
            long diffInMillies = Math.abs(rentalEndDate.getTime() - rentalStartDate.getTime());
            long days = diffInMillies / (1000 * 60 * 60 * 24) + 1; // Include both start and end day
            double totalAmount = days * car.getRentalRatePerDay();
    
            // Create new booking
            Booking booking = new Booking();
            booking.setUser(optionalUser.get());
            booking.setCar(car);
            booking.setRentalStartDate(rentalStartDate);
            booking.setRentalEndDate(rentalEndDate);
            booking.setStatus("pending");
            booking.setTotalAmount(totalAmount);
            booking.setPaymentStatus("pending");
    
            // Update car status to booked
            car.setStatus("booked");
            carRepository.save(car);
    
            // Save booking
            return bookingRepository.save(booking);
        }
    public List<Booking> getBookingsByUserId(Long userId){
        return bookingRepository.findByUserId(userId);
    }
}