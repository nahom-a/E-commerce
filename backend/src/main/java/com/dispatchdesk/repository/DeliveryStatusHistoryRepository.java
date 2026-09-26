package com.dispatchdesk.repository;

import com.dispatchdesk.entity.DeliveryStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryStatusHistoryRepository extends JpaRepository<DeliveryStatusHistory, Long> {
    List<DeliveryStatusHistory> findByDeliveryIdOrderByChangedAtAsc(Long deliveryId);

    @Query("SELECT h FROM DeliveryStatusHistory h WHERE h.delivery.id = :deliveryId ORDER BY h.changedAtAsc")
    List<DeliveryStatusHistory> findByDeliveryId(@Param("deliveryId") Long deliveryId);
}
