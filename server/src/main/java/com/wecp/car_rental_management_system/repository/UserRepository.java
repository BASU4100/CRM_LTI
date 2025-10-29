package com.wecp.car_rental_management_system.repository;

import com.wecp.car_rental_management_system.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom finder method
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
