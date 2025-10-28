package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.Car;
import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

@Service
public class CarCategoryService {
    // implement car category service
    @Autowired
    CarCategoryRepository carCategoryRepository;

    // private static final Logger logger = Logger.getLogger(CarCategoryService.class);

    //create Car Category
    public CarCategory createCarCategory(CarCategory carCategory){
        // logger.info(carCategory);
        if (carCategoryRepository.findByName(carCategory.getName()).isEmpty()) {
            return  carCategoryRepository.save(carCategory);
        }
        return null;
    }

    //Get all car categories
    public List<CarCategory> getAllCarCategories(){
        return carCategoryRepository.findAll();
    }

    //update car category after checking id exists or not
    @Modifying
    @Transactional
    public CarCategory updateCarCategory(Long categoryId,CarCategory updatedCarCategory){
        CarCategory carCategory = carCategoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Car category not found."));
        updatedCarCategory.setId(categoryId);
        updatedCarCategory.setCars(carCategory.getCars());
        return carCategoryRepository.save(updatedCarCategory);
    }
}

