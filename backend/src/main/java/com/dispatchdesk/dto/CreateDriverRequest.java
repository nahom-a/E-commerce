package com.dispatchdesk.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateDriverRequest {
    private String phone;
    private String vehicle;
    private String licenseNumber;
    private String status;
}
