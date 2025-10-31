package com.wecp.car_rental_management_system.repository;

import com.wecp.car_rental_management_system.entity.Booking;
import com.wecp.car_rental_management_system.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
           "FROM Booking b " +
           "WHERE b.car = :car " +
           "AND b.status NOT IN ('completed', 'cancelled') " +
           "AND b.rentalStartDate < :endDate " +
           "AND b.rentalEndDate > :startDate")
    boolean existsByCarAndDateOverlap(@Param("car") Car car,
                                      @Param("startDate") Date startDate,
                                      @Param("endDate") Date endDate);
}