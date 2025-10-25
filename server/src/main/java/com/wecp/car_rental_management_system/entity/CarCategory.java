package com.wecp.car_rental_management_system.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Table(name = "car_categories") // do not change this line i.e table name
@Entity
public class CarCategory {
    // implement entity
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    String name;
    Double baseRate;
    @OneToMany(mappedBy = "category")
    List<Car> cars;

    //constructors
    public CarCategory() {
    }
    
    public CarCategory(String name, Double baseRate, List<Car> cars) {
        this.name = name;
        this.baseRate = baseRate;
        this.cars = cars;
    }

    public CarCategory(Long id, String name, Double baseRate, List<Car> cars) {
        this.id = id;
        this.name = name;
        this.baseRate = baseRate;
        this.cars = cars;
    }

    //getter and setter for id

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    //getter and setter for Name

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    //getter and setter for BaseRate

    public Double getBaseRate() {
        return baseRate;
    }
    public void setBaseRate(Double baseRate) {
        this.baseRate = baseRate;
    }

    //getter and setter for List of Cars

    public List<Car> getCars() {
        return cars;
    }
    public void setCars(List<Car> cars) {
        this.cars = cars;
    }
    

}
