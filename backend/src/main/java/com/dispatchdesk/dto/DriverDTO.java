package com.dispatchdesk.dto;

import com.dispatchdesk.enums.DriverStatus;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverDTO {
    private Long id;
    private String phone;
    private String vehicle;
    private String licenseNumber;
    private DriverStatus status;
    private String userName;
    private int activeDeliveries;
}
