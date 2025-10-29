package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.exceptions.ResourceAlreadyExistsException;
import com.wecp.car_rental_management_system.exceptions.ResourceNotFoundException;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;
import com.wecp.car_rental_management_system.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {
    // implement car service
    private final CarRepository carRepository;
    private final CarCategoryRepository carCategoryRepository;

    @Autowired
    public CarService(CarRepository carRepository, CarCategoryRepository carCategoryRepository) {
        this.carRepository = carRepository;
        this.carCategoryRepository = carCategoryRepository;
    }

    //adds a new car when the car category is present
    public Car addCar(Car car) {
        // if (carRepository.findByRegistrationNumber(car.getRegistrationNumber()).isPresent() || car.getCategory()==null || car.getCategory().getId()==null){
        //     return null;
        // }
        // else {
        //     Optional<CarCategory> carCategory= carCategoryRepository.findById(car.getCategory().getId());
        //     if (carCategory.isPresent()) {
        //         car.setCategory(carCategory.get());
        //         return carRepository.save(car);
        //     }
        //     else
        //         return null;
        // }
        if (car.getCategory()==null) {
            throw new ResourceNotFoundException("Car category not provided.");
        }
        else if (car.getCategory().getId()==null) {
            throw new ResourceNotFoundException("Car category id not provided.");
        }
        carRepository.findByRegistrationNumber(car.getRegistrationNumber()).ifPresent(existing -> {throw new ResourceAlreadyExistsException("Car already exists.");});
        CarCategory carCategory = carCategoryRepository.findById(car.getCategory().getId()).orElseThrow(() -> new ResourceNotFoundException("Car category not found."));
        car.setCategory(carCategory);
        return carRepository.save(car);
    }

    //updates an existing car
    public Car updateCar(Long carId, Car updatedCar) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found.")); 
        updatedCar.setId(carId);
        updatedCar.setBookings(car.getBookings());
        return carRepository.save(updatedCar);
    }

    //get available cars after checking the availale status
    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("available");
    }

    //gets all cars
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}
