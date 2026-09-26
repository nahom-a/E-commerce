package com.dispatchdesk;

import com.dispatchdesk.dto.DashboardStatsDTO;
import com.dispatchdesk.entity.Delivery;
import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.PackageSize;
import com.dispatchdesk.enums.Priority;
import com.dispatchdesk.repository.ActivityLogRepository;
import com.dispatchdesk.repository.DeliveryRepository;
import com.dispatchdesk.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @BeforeEach
    void setUp() {
        activityLogRepository.deleteAll();
        deliveryRepository.deleteAll();
    }

    @Test
    void testGetStatsReturnsCountsAndLast7Days() {
        Delivery pending = Delivery.builder()
            .deliveryNumber("DLV-1001")
            .recipientName("Test Recipient 1")
            .recipientPhone("+251911")
            .address("Bole")
            .packageDescription("Box 1")
            .packageSize(PackageSize.SMALL)
            .priority(Priority.NORMAL)
            .status(DeliveryStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        Delivery outForDel = Delivery.builder()
            .deliveryNumber("DLV-1002")
            .recipientName("Test Recipient 2")
            .recipientPhone("+251912")
            .address("CMC")
            .packageDescription("Box 2")
            .packageSize(PackageSize.MEDIUM)
            .priority(Priority.URGENT)
            .status(DeliveryStatus.OUT_FOR_DELIVERY)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        deliveryRepository.save(pending);
        deliveryRepository.save(outForDel);

        DashboardStatsDTO stats = dashboardService.getStats();

        assertNotNull(stats);
        assertEquals(1, stats.getPendingAssignment());
        assertEquals(1, stats.getActiveDeliveries()); // OUT_FOR_DELIVERY counts as active
        assertEquals(1, stats.getOutForDelivery());
        assertEquals(7, stats.getDeliveriesLast7Days().size());
    }
}
