package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.repository.BookingRepository;
import com.wecp.car_rental_management_system.repository.CarRepository;
import com.wecp.car_rental_management_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService{
    // implement booking service

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    //get all bookings in the system.
    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }
    //update the status of a booking.
    public Booking updateBookingStatus(Long bookingId, String status){
        Booking booking = bookingRepository.findById(bookingId).get();
        if(Optional.of(booking).isPresent()){
            
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }else{
            throw new RuntimeException("Booking not found with ID: "+bookingId);
        }
    }

    //book a car for a user between rentalStartDate and rentalEndDate.
    public Booking bookCar(Long userId , Long carId, Date rentalStartDate, Date rentalEndDate){
        Optional<User> user = userRepository.findById(userId);
        Optional<Car> car = carRepository.findById(carId);
        if(user.isPresent() && car.isPresent()){
            Booking booking = new Booking();
            booking.setUser(user.get());
            booking.setCar(car.get());
            booking.setRentalEndDate(rentalEndDate);
            booking.setRentalStartDate(rentalStartDate);
            booking.setStatus("pending");
            booking.setPaymentStatus("unpaid");

            long durationInDays = (rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 60 * 60 * 24);
            double totalAmount =  durationInDays * car.get().getRentalRatePerDay();
            booking.setTotalAmount(totalAmount);

            // car.setStatus("booked");
            // carRepository.save(car);

            return bookingRepository.save(booking);
        }else{
            throw new RuntimeException("User or Car not found");
        }
        
    }

}
