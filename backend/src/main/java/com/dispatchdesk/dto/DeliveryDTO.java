package com.dispatchdesk.dto;

import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.Priority;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryDTO {
    private Long id;
    private String deliveryNumber;
    private Long customerId;
    private String customerName;
    private String recipientName;
    private String recipientPhone;
    private String address;
    private String city;
    private String packageDescription;
    private String packageSize;
    private Priority priority;
    private DeliveryStatus status;
    private Long driverId;
    private String driverName;
    private LocalDateTime scheduledDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
