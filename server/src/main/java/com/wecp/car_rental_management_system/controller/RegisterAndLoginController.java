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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RegisterAndLoginController {

  private final UserService userService;
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  

  public RegisterAndLoginController(UserService userService, AuthenticationManager authenticationManager,
      JwtUtil jwtUtil) {
    this.userService = userService;
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
  }

    //Register a user
    @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
      User registeredUser = userService.registerUser(user);
      return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    //user login
    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        // login user and return jwt token in LoginResponse object
        // if authentication fails return 401 unauthorized http status code
        try{
          authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        }catch(AuthenticationException e){
          throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Username or Password", e);
        }
        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(UserDetails.getUsername());
        User user = userService.getCustomerByName(UserDetails.getUsername());
        return new ResponseEntity<>(new LoginResponse(token, user.getRole(), user.getUserId()), HttpStatus.OK);
}
}
