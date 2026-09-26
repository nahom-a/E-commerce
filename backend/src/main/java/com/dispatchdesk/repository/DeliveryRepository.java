package com.dispatchdesk.repository;

import com.dispatchdesk.entity.Delivery;
import com.dispatchdesk.enums.DeliveryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByDeliveryNumber(String deliveryNumber);

    @Query("SELECT d FROM Delivery d WHERE " +
        "LOWER(d.deliveryNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.recipientName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.customer.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.address) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
        "LOWER(d.city) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Delivery> search(@Param("search") String search, Pageable pageable);

    Page<Delivery> findByStatus(DeliveryStatus status, Pageable pageable);

    Page<Delivery> findByDriverId(Long driverId, Pageable pageable);

    Page<Delivery> findByStatusAndDriverId(DeliveryStatus status, Long driverId, Pageable pageable);

    List<Delivery> findByDriverId(Long driverId);

    List<Delivery> findByCustomerId(Long customerId);

    long countByStatus(DeliveryStatus status);

    long countByStatusIn(Collection<DeliveryStatus> statuses);

    long countByStatusAndUpdatedAtBetween(DeliveryStatus status, LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(d) FROM Delivery d WHERE d.driver.id = :driverId AND d.status IN :statuses")
    int countActiveByDriverId(@Param("driverId") Long driverId, @Param("statuses") Collection<DeliveryStatus> statuses);
}
