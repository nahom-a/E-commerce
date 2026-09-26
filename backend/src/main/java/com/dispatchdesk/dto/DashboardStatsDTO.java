package com.dispatchdesk.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsDTO {
    private long activeDeliveries;
    private long pendingAssignment;
    private long outForDelivery;
    private long deliveredToday;
    private long failedToday;
    private List<DeliveryCountDTO> deliveriesLast7Days;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DeliveryCountDTO {
        private String date;
        private long count;
    }
}
