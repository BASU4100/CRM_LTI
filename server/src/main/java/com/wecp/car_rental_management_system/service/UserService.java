package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;

    //User Register
    public User registerUser(User user){
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
