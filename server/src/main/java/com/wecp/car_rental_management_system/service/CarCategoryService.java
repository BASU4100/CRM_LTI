package com.wecp.car_rental_management_system.service;

import com.wecp.car_rental_management_system.entity.CarCategory;
import com.wecp.car_rental_management_system.repository.CarCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarCategoryService {
    // implement car category service
    @Autowired
    CarCategoryRepository carCategoryRepository;

    //create Car Category
    public CarCategory createCarCategory(CarCategory carCategory){
        return  carCategoryRepository.save(carCategory);
    }
    //Get all car categories
    public List<CarCategory> getAllCarCategories(){
        return carCategoryRepository.findAll();
    }

    //update car category
    public CarCategory updateCarCategory(Long categoryId,CarCategory updatedCarCategory){
        CarCategory carCategory=carCategoryRepository.findById(categoryId).get();
        if(carCategory !=null && carCategory.getId()!=updatedCarCategory.getId()){
            updatedCarCategory.setId(categoryId);
            return carCategoryRepository.save(updatedCarCategory);
        }
        return null;
    }
}

