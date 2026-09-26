package com.dispatchdesk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_status_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;
    @Column(name = "old_status")
    private String oldStatus;
    @Column(name = "new_status", nullable = false)
    private String newStatus;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;
    @CreationTimestamp
    private LocalDateTime changedAt;
    private String note;
}
