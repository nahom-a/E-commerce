package com.dispatchdesk.service;

import com.dispatchdesk.dto.DashboardStatsDTO;
import com.dispatchdesk.entity.ActivityLog;
import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.repository.ActivityLogRepository;
import com.dispatchdesk.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public DashboardStatsDTO getStats() {
        List<DeliveryStatus> activeStatuses = Arrays.asList(
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.PICKED_UP,
            DeliveryStatus.OUT_FOR_DELIVERY
        );
        long activeDeliveries = deliveryRepository.countByStatusIn(activeStatuses);
        long pendingAssignment = deliveryRepository.countByStatus(DeliveryStatus.PENDING);
        long outForDelivery = deliveryRepository.countByStatus(DeliveryStatus.OUT_FOR_DELIVERY);

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        long deliveredToday = deliveryRepository.countByStatusAndUpdatedAtBetween(DeliveryStatus.DELIVERED, startOfToday, endOfToday);
        long failedToday = deliveryRepository.countByStatusAndUpdatedAtBetween(DeliveryStatus.FAILED, startOfToday, endOfToday);

        List<DashboardStatsDTO.DeliveryCountDTO> last7Days = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.atTime(LocalTime.MAX);
            long count = deliveryRepository.countByCreatedAtBetween(dayStart, dayEnd);
            last7Days.add(new DashboardStatsDTO.DeliveryCountDTO(date.format(formatter), count));
        }

        return new DashboardStatsDTO(
            activeDeliveries,
            pendingAssignment,
            outForDelivery,
            deliveredToday,
            failedToday,
            last7Days
        );
    }

    public List<ActivityLog> getRecentActivity() {
        return activityLogRepository.findAllByOrderByCreatedAtDesc();
    }
}
