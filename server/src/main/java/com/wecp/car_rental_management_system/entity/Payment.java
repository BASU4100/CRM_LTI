package com.wecp.car_rental_management_system.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payments") // do not change this line i.e table name
public class Payment {
    // implement entity

    // attributes
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double amount;
    private Date paymentDate;
    private String paymentMethod;
    private String paymentStatus;
    @OneToOne
    private Booking booking;


    // constructors
    public Payment() {
    }

    public Payment(Long id, Double amount, Date paymentDate, String paymentMethod, String paymentStatus,
            Booking booking) {
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.booking = booking;
    }

    public Payment(Double amount, Date paymentDate, String paymentMethod, String paymentStatus, Booking booking) {
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.booking = booking;
    }

    public Payment(Double amount, Date paymentDate, String paymentMethod, String paymentStatus) {
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    // getter and setter for attributes
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Long getBookingId() {
        return booking.getId();
    }

    public void setBookingId(Long id) {
        this.booking.setId(id);
    }
}