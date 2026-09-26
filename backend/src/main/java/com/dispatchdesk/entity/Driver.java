package com.dispatchdesk.entity;

import com.dispatchdesk.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    private String phone;
    private String vehicle;
    private String licenseNumber;
    @Enumerated(EnumType.STRING)
    private DriverStatus status;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
