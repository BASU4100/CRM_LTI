package com.wecp.car_rental_management_system.config;

import com.wecp.car_rental_management_system.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


public class SecurityConfig {

    // configure the security of the application such that
    // /api/user/register and /api/user/login are permitted to all
    // /api/administrator/car-categories is permitted to ADMINISTRATOR
    // /api/administrator/car-categories is permitted to ADMINISTRATOR
    // /api/administrator/car-categories/{categoryId} is permitted to ADMINISTRATOR
    // /api/administrator/reports/bookings is permitted to ADMINISTRATOR
    // /api/administrator/reports/payments is permitted to ADMINISTRATOR
    // /api/agent/car is permitted to AGENT
    // /api/agent/car/{carId} is permitted to AGENT
    // /api/agent/bookings is permitted to AGENT
    // /api/agent/bookings/{bookingId}/status is permitted to AGENT
    // /api/agent/payment/{bookingId}  is permitted to AGENT
    // /api/customers/cars/available is permitter to CUSTOMER
    // /api/customers/booking is permitter to CUSTOMER

    // note that check the permission with respect to authority
    // for example hasAuthority("ADMINISTRATOR")

}