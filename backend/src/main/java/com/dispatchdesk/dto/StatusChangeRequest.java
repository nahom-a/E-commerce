package com.dispatchdesk.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatusChangeRequest {
    private String newStatus;
}
