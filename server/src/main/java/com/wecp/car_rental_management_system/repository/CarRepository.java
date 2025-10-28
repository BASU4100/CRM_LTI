package com.wecp.car_rental_management_system.repository;

import com.wecp.car_rental_management_system.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car,Long>{
    // implement jpa repository here

    //Custom finder method
    List<Car> findByStatus(String status);

    //Find cars by registration number
    Optional<Car> findByRegistrationNumber(String registrationNumber);
}
