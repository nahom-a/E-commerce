package com.dispatchdesk.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_status_history")
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
    @Column(name = "changed_at", updatable = false)
    private LocalDateTime changedAt;

    private String note;

    public DeliveryStatusHistory() {}

    public DeliveryStatusHistory(Long id, Delivery delivery, String oldStatus, String newStatus, User changedBy, LocalDateTime changedAt, String note) {
        this.id = id;
        this.delivery = delivery;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
        this.note = note;
    }

    public static DeliveryStatusHistoryBuilder builder() {
        return new DeliveryStatusHistoryBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Delivery getDelivery() { return delivery; }
    public void setDelivery(Delivery delivery) { this.delivery = delivery; }

    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public User getChangedBy() { return changedBy; }
    public void setChangedBy(User changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public static class DeliveryStatusHistoryBuilder {
        private Long id;
        private Delivery delivery;
        private String oldStatus;
        private String newStatus;
        private User changedBy;
        private LocalDateTime changedAt;
        private String note;

        public DeliveryStatusHistoryBuilder id(Long id) { this.id = id; return this; }
        public DeliveryStatusHistoryBuilder delivery(Delivery delivery) { this.delivery = delivery; return this; }
        public DeliveryStatusHistoryBuilder oldStatus(String oldStatus) { this.oldStatus = oldStatus; return this; }
        public DeliveryStatusHistoryBuilder newStatus(String newStatus) { this.newStatus = newStatus; return this; }
        public DeliveryStatusHistoryBuilder changedBy(User changedBy) { this.changedBy = changedBy; return this; }
        public DeliveryStatusHistoryBuilder changedAt(LocalDateTime changedAt) { this.changedAt = changedAt; return this; }
        public DeliveryStatusHistoryBuilder note(String note) { this.note = note; return this; }

        public DeliveryStatusHistory build() {
            return new DeliveryStatusHistory(id, delivery, oldStatus, newStatus, changedBy, changedAt, note);
        }
    }
}
