package com.wecp.car_rental_management_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import org.hibernate.action.internal.OrphanRemovalAction;

import java.util.List;

@Entity
@Table(name = "cars") // do not change this line i.e table name
public class Car {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String make;
    private String model;
    private String manufactureYear;
    private String registrationNumber;
    private String status;
    private Double rentalRatePerDay;
    
    @ManyToOne
    private CarCategory category;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings;

    //constructors

    public Car(Long id, String make,  String model, String manufactureYear, String registrationNumber, String status,
            Double rentalRatePerDay, CarCategory category, List<Booking> bookings) {
        this.id = id;
        this.make = make;
        this.manufactureYear = manufactureYear;
        this.registrationNumber = registrationNumber;
        this.status = status;
        this.rentalRatePerDay = rentalRatePerDay;
        this.category = category;
        this.bookings = bookings;
        this.model = model;
    }
    
    public Car(String make, String model, String manufactureYear, String registrationNumber, String status, Double rentalRatePerDay,
    CarCategory category, List<Booking> bookings) {
        this.make = make;
        this.manufactureYear = manufactureYear;
        this.registrationNumber = registrationNumber;
        this.status = status;
        this.rentalRatePerDay = rentalRatePerDay;
        this.category = category;
        this.bookings = bookings;
        this.model = model;
    }

    public Car() {
    }

    //getter and setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getManufactureYear() {
        return manufactureYear;
    }

    public void setManufactureYear(String manufactureYear) {
        this.manufactureYear = manufactureYear;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getRentalRatePerDay() {
        return rentalRatePerDay;
    }

    public void setRentalRatePerDay(Double rentalRatePerDay) {
        this.rentalRatePerDay = rentalRatePerDay;
    }

    public CarCategory getCategory() {
        return category;
    }

    public void setCategory(CarCategory category) {
        this.category = category;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
