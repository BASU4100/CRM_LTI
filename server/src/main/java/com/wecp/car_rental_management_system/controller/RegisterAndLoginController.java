package com.wecp.car_rental_management_system.controller;

import com.wecp.car_rental_management_system.dto.LoginRequest;
import com.wecp.car_rental_management_system.dto.LoginResponse;
import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.jwt.JwtUtil;
import com.wecp.car_rental_management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RegisterAndLoginController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    public RegisterAndLoginController(UserService userService, AuthenticationManager authenticationManager,
            JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) throws Exception {
        User registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        }
        catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Username or Password", e);
        }
        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails.getUsername());
        User user = userService.getUserByUsername(userDetails.getUsername());
        return new ResponseEntity<>(new LoginResponse(user.getId(), token, user.getUsername(), user.getEmail(), user.getRole()), HttpStatus.OK);
    }
}