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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtutil;

    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
      // register a user
      return new ResponseEntity<>(userService.registerUser(user),HttpStatus.CREATED);
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        // login user and return jwt token in LoginResponse object
        // if authentication fails return 401 unauthorized http status code
      User user = userService.getUserByUsername(loginRequest.getUsername());
      if(user!=null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
        String token = jwtutil.generateToken(user.getUsername());
        LoginResponse response = new LoginResponse(user.getId(),token,user.getUsername(), user.getEmail(), user.getRole());

        return ResponseEntity.ok(response);
      }
      else{
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
    }
}
