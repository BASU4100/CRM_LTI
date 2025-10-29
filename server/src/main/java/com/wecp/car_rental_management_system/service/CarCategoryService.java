package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.exceptions.ResourceAlreadyExistsException;
import com.wecp.car_rental_management_system.exceptions.ResourceNotFoundException;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;

import javax.transaction.Transactional;

// implement car category service
@Service
public class CarCategoryService {
    @Autowired
    CarCategoryRepository carCategoryRepository;

    // private static final Logger logger = Logger.getLogger(CarCategoryService.class);

    //create Car Category
    public CarCategory createCarCategory(CarCategory carCategory){
        // logger.info(carCategory);
        // if (carCategoryRepository.findByName(carCategory.getName()).isPresent()) {
            //     throw new ResourceAlreadyExists("Car category already exists.");
            // }
        carCategoryRepository.findByName(carCategory.getName()).ifPresent(e -> {throw new ResourceAlreadyExistsException("Car category already exists.");});
        return  carCategoryRepository.save(carCategory);
    }

    //Get all car categories
    public List<CarCategory> getAllCarCategories(){
        return carCategoryRepository.findAll();
    }

    //update car category after checking id exists or not
    @Modifying
    @Transactional
    public CarCategory updateCarCategory(Long categoryId,CarCategory updatedCarCategory){
        CarCategory carCategory = carCategoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Car category not found."));
        updatedCarCategory.setId(categoryId);
        updatedCarCategory.setCars(carCategory.getCars());
        return carCategoryRepository.save(updatedCarCategory);
    }
}

