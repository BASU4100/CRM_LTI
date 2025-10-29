package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.User;
import com.wecp.car_rental_management_system.exceptions.ResourceAlreadyExistsException;
import com.wecp.car_rental_management_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // User Register
    public User registerUser(User user) throws ResourceAlreadyExistsException{
        String email = user.getEmail();
        String username = user.getUsername();

        // checking if the username already exists
        userRepository.findByUsername(username).ifPresent(e -> {
            throw new ResourceAlreadyExistsException(String.format("Username : %s not available.", username));
        });

        // checking if the email already exists or not
        userRepository.findByEmail(email).ifPresent(e -> {
            throw new ResourceAlreadyExistsException("Duplicate Email not allowed.");
        });

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole((user.getRole().toUpperCase()));

        return userRepository.save(user);
    }

    // Find User - finder method used.
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).get();
    }

    // Load User Details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).get();
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                AuthorityUtils.createAuthorityList(user.getRole()));
    }
}
