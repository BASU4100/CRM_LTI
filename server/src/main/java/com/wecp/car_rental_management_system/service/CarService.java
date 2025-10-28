package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.exceptions.ResourceAlreadyExists;
import com.wecp.car_rental_management_system.exceptions.ResourceNotFound;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;
import com.wecp.car_rental_management_system.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public Car addCar(Car car) throws ResourceNotFound, ResourceAlreadyExists {
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
        carRepository.findByRegistrationNumber(car.getRegistrationNumber()).ifPresent(existing -> {throw new ResourceAlreadyExists("Car already exists.");});
        if (car.getCategory()==null) {
            throw new ResourceNotFound("Car category not provided.");
        }
        else if (car.getCategory().getId()==null) {
            throw new ResourceNotFound("Car category id not provided.");
        }
        CarCategory carCategory = carCategoryRepository.findById(car.getCategory().getId()).orElseThrow(() -> new ResourceNotFound("Car category not found."));
        car.setCategory(carCategory);
        return carRepository.save(car);
    }

    //updates an existing car
    public Car updateCar(Long carId, Car updatedCar) throws ResourceNotFound {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFound("Car not found.")); 
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
