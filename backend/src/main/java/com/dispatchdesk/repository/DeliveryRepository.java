package com.dispatchdesk.repository;

import com.dispatchdesk.entity.Delivery;
import com.dispatchdesk.enums.DeliveryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByDeliveryNumber(String deliveryNumber);

    @Query("SELECT d FROM Delivery d WHERE " +
        "LOWER(d.deliveryNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.recipientName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.customer.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.address) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Delivery> search(@Param("search") String search, Pageable pageable);

    Page<Delivery> findByStatus(DeliveryStatus status, Pageable pageable);

    @Query("SELECT d FROM Delivery d WHERE d.status = :status AND d.driver.id = :driverId")
    Page<Delivery> findByStatusAndDriverId(@Param("status") DeliveryStatus status, @Param("driverId") Long driverId, Pageable pageable);

    @Query("SELECT d FROM Delivery d WHERE d.driver.id = :driverId")
    List<Delivery> findByDriverId(@Param("driverId") Long driverId);

    Page<Delivery> findByDriverId(@Param("driverId") Long driverId, Pageable pageable);

    @Query("SELECT d FROM Delivery d WHERE d.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT d FROM Delivery d WHERE d.status = :status AND DATE(d.createdAt) = :date")
    long countByStatusAndDate(@Param("status") String status, @Param("date") java.time.LocalDate date);

    @Query("SELECT d FROM Delivery d WHERE DATE(d.createdAt) = :date")
    long countByCreatedDate(@Param("date") java.time.LocalDate date);
}
