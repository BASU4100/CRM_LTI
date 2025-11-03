package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.exceptions.ResourceAlreadyExistsException;
import com.wecp.car_rental_management_system.exceptions.ResourceNotFoundException;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;
import com.wecp.car_rental_management_system.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//image import
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class CarService {
    // implement car service
    private final CarRepository carRepository;
    private final CarCategoryRepository carCategoryRepository;
    private final FileStorageService fileStorageService;
    
    @Autowired
    public CarService(CarRepository carRepository, CarCategoryRepository carCategoryRepository, FileStorageService fileStorageService) {
        this.carRepository = carRepository;
        this.carCategoryRepository = carCategoryRepository;
        this.fileStorageService = fileStorageService;
    }

    //adds a new car when the car category is present with image
    public Car addCar(Car car, MultipartFile image) {
        if (car.getCategory()==null) {
            throw new ResourceNotFoundException("Car category not provided.");
        }
        else if (car.getCategory().getId()==null) {
            throw new ResourceNotFoundException("Car category id not provided.");
        }
        if (image != null) {
            String filename = fileStorageService.storeFile(image);
            car.setImageUrl(filename);
        }
        carRepository.findByRegistrationNumber(car.getRegistrationNumber()).ifPresent(existing -> {throw new ResourceAlreadyExistsException("Car already exists.");});
        CarCategory carCategory = carCategoryRepository.findById(car.getCategory().getId()).orElseThrow(() -> new ResourceNotFoundException("Car category not found."));
        car.setCategory(carCategory);
        return carRepository.save(car);
    }

    //updates an existing car with image
    public Car updateCar(Long carId, Car updatedCar, MultipartFile image) {
            Car existingCar = carRepository.findById(carId)
                    .orElseThrow(() -> new RuntimeException("Car not found"));
            existingCar.setMake(updatedCar.getMake());
            existingCar.setModel(updatedCar.getModel());
            existingCar.setManufactureYear(updatedCar.getManufactureYear());
            existingCar.setRegistrationNumber(updatedCar.getRegistrationNumber());
            existingCar.setStatus(updatedCar.getStatus());
            existingCar.setRentalRatePerDay(updatedCar.getRentalRatePerDay());
            if (updatedCar.getCategory() != null) {
                CarCategory category = carCategoryRepository.findById(updatedCar.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Car category not found"));
                existingCar.setCategory(category);
            }
            if (image != null) {
                String filename = fileStorageService.storeFile(image);
                existingCar.setImageUrl(filename);
            }
            return carRepository.save(existingCar);
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
