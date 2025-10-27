package com.wecp.car_rental_management_system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import org.springframework.security.core.GrantedAuthority;

import java.util.List;


@Table(name = "users") // do not change this line i.e table name
@Entity
public class User {
    // Attributes of User entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(unique = true)
    private String username;
    private String password;
    @Column(unique = true)
    private String email;
    private String role;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Booking> bookings;

    //Constructors
    public User() {
    }

    
    public User(String username, String password, String email, String role, List<Booking> bookings) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.bookings = bookings;
    }


    public User(Long id, String username, String password, String email, String role, List<Booking> bookings) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.bookings = bookings;
    }

    //Getters and Setters method
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public List<Booking> getBookings() {
        return bookings;
    }
    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    
}
