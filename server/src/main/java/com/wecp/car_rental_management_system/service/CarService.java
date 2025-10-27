package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.CarCategory;
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
    public Car addCar(Car car){
        if (car.getCategory()==null || car.getCategory().getId()==null){
            return null;
        }
        else {
            Optional<CarCategory> carCategory= carCategoryRepository.findById(car.getCategory().getId());
            if (carCategory.isPresent()) {
                car.setCategory(carCategory.get());
                return carRepository.save(car);
            }
            else
                return null;
        }
    }

    //updates an existing car
    public Car updateCar(Long carId,Car updatedCar)
    {
        Optional<Car> obj = carRepository.findById(carId);  
        Car car = obj.get();
        car.setBookings(updatedCar.getBookings());
        car.setCategory(updatedCar.getCategory());
        car.setMake(updatedCar.getMake());
        car.setManufactureYear(updatedCar.getManufactureYear());
        car.setRegistrationNumber(updatedCar.getRegistrationNumber());
        car.setRentalRatePerDay(updatedCar.getRentalRatePerDay());
        car.setStatus(updatedCar.getStatus());
        return carRepository.save(car);
    }

    //get available cars after checking the availale status
    public List<Car> getAvailableCars()
    {
        return carRepository.findByStatus("available");
    }

    //gets all cars
    public List<Car> getAllCars()
    {
        return carRepository.findAll();
    }
}
