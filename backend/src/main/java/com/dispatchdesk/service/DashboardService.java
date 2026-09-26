package com.dispatchdesk.service;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.entity.*;
import com.dispatchdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    @Autowired private DeliveryRepository deliveryRepository;
    @Autowired private ActivityLogRepository activityLogRepository;

    public DashboardStatsDTO getStats() {
        long activeDeliveries = deliveryRepository.countByStatus("ACTIVE");
        long pendingAssignment = deliveryRepository.countByStatus("PENDING");
        long outForDelivery = deliveryRepository.countByStatus("OUT_FOR_DELIVERY");
        long deliveredToday = deliveryRepository.countByStatusAndDate("DELIVERED", LocalDate.now());
        long failedToday = deliveryRepository.countByStatusAndDate("FAILED", LocalDate.now());

        List<DeliveryCountDTO> last7Days = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = now.toLocalDate().minusDays(i);
            long count = deliveryRepository.countByCreatedDate(date);
            last7Days.add(DeliveryCountDTO.builder()
                .date(date.format(formatter))
                .count(count)
                .build());
        }

        return DashboardStatsDTO.builder()
            .activeDeliveries(activeDeliveries)
            .pendingAssignment(pendingAssignment)
            .outForDelivery(outForDelivery)
            .deliveredToday(deliveredToday)
            .failedToday(failedToday)
            .deliveriesLast7Days(last7Days)
            .build();
    }

    public List<ActivityLog> getRecentActivity() {
        return activityLogRepository.findAllOrderByCreatedAtDesc();
    }
}
