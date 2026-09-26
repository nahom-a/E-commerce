package com.dispatchdesk.dto;

import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.Priority;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateDeliveryRequest {
    private Long customerId;
    private String recipientName;
    private String recipientPhone;
    private String address;
    private String city;
    private String packageDescription;
    private String packageSize;
    private Priority priority;
    private LocalDateTime scheduledDate;
    private Long driverId;
}
