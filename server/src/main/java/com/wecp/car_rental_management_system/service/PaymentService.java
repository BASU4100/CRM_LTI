package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Payment;
import com.wecp.car_rental_management_system.exceptions.ResourceNotFoundException;
import com.wecp.car_rental_management_system.repository.BookingRepository;
import com.wecp.car_rental_management_system.repository.PaymentRepository;
// import com.wecp.car_rental_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    // implement payment service
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingRepository bookingRepository;

    // fetch all payments from database
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // create a new payment after fetching the booking with bookingId
    public Payment generateInvoice(Long bookingId, Payment paymentRequest) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        paymentRequest.setBooking(booking);
        return paymentRepository.save(paymentRequest);
    }
}
