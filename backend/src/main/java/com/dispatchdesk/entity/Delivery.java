package com.dispatchdesk.entity;

import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.Priority;
import com.dispatchdesk.enums.PackageSize;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "delivery_number", unique = true, nullable = false)
    private String deliveryNumber;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @Column(name = "recipient_name", nullable = false)
    private String recipientName;
    @Column(name = "recipient_phone", nullable = false)
    private String recipientPhone;
    private String address;
    private String city;
    @Column(name = "package_description", nullable = false)
    private String packageDescription;
    @Enumerated(EnumType.STRING)
    private PackageSize packageSize;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;
    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

