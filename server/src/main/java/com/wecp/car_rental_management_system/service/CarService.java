package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {
    // implement car service
    private CarRepository carRepository;

    @Autowired
    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    //adds a new car
    public Car addCar(Car car)
    {
        return carRepository.save(car);
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
