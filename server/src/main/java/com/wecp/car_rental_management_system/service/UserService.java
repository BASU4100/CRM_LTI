package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// import java.util.ArrayList;
// import java.util.List;

@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    //User Register
    public User registerUser(User user) throws Exception{
       String role = user.getRole();
    //    String email = user.getEmail();
       String username = user.getUsername();

       if(!role.equalsIgnoreCase("ADMINISTRATOR") && !role.equalsIgnoreCase("AGENT") && !role.equalsIgnoreCase("CUSTOMER")){
            throw new Exception("Invalid role. Only 'ADMINISTRATOR' or 'AGENT' or 'CUSTOMER' allowed.");
       }

       if(userRepository.findByUsername(username) != null){
            throw new Exception("Username '" + username + "' already exists.");
       }
       
    //    user.setUsername(username);
       user.setPassword(passwordEncoder.encode(user.getPassword()));
       user.setRole((role.toUpperCase()));

        return userRepository.save(user);
    }

    //Find User - finder method used.
    public User getUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

    //Load User Details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       
        throw new UsernameNotFoundException(username); // dummy exception
    }

}
