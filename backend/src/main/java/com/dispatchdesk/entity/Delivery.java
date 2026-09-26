package com.dispatchdesk.entity;

import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.PackageSize;
import com.dispatchdesk.enums.Priority;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
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
    @Column(name = "package_size")
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
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Delivery() {}

    public Delivery(Long id, String deliveryNumber, Customer customer, String recipientName, String recipientPhone,
                    String address, String city, String packageDescription, PackageSize packageSize,
                    Priority priority, DeliveryStatus status, Driver driver, LocalDateTime scheduledDate,
                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.deliveryNumber = deliveryNumber;
        this.customer = customer;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.address = address;
        this.city = city;
        this.packageDescription = packageDescription;
        this.packageSize = packageSize;
        this.priority = priority;
        this.status = status;
        this.driver = driver;
        this.scheduledDate = scheduledDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DeliveryBuilder builder() {
        return new DeliveryBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeliveryNumber() { return deliveryNumber; }
    public void setDeliveryNumber(String deliveryNumber) { this.deliveryNumber = deliveryNumber; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPackageDescription() { return packageDescription; }
    public void setPackageDescription(String packageDescription) { this.packageDescription = packageDescription; }

    public PackageSize getPackageSize() { return packageSize; }
    public void setPackageSize(PackageSize packageSize) { this.packageSize = packageSize; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class DeliveryBuilder {
        private Long id;
        private String deliveryNumber;
        private Customer customer;
        private String recipientName;
        private String recipientPhone;
        private String address;
        private String city;
        private String packageDescription;
        private PackageSize packageSize;
        private Priority priority;
        private DeliveryStatus status;
        private Driver driver;
        private LocalDateTime scheduledDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public DeliveryBuilder id(Long id) { this.id = id; return this; }
        public DeliveryBuilder deliveryNumber(String deliveryNumber) { this.deliveryNumber = deliveryNumber; return this; }
        public DeliveryBuilder customer(Customer customer) { this.customer = customer; return this; }
        public DeliveryBuilder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public DeliveryBuilder recipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; return this; }
        public DeliveryBuilder address(String address) { this.address = address; return this; }
        public DeliveryBuilder city(String city) { this.city = city; return this; }
        public DeliveryBuilder packageDescription(String packageDescription) { this.packageDescription = packageDescription; return this; }
        public DeliveryBuilder packageSize(PackageSize packageSize) { this.packageSize = packageSize; return this; }
        public DeliveryBuilder priority(Priority priority) { this.priority = priority; return this; }
        public DeliveryBuilder status(DeliveryStatus status) { this.status = status; return this; }
        public DeliveryBuilder driver(Driver driver) { this.driver = driver; return this; }
        public DeliveryBuilder scheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public DeliveryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DeliveryBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Delivery build() {
            return new Delivery(id, deliveryNumber, customer, recipientName, recipientPhone, address, city, packageDescription, packageSize, priority, status, driver, scheduledDate, createdAt, updatedAt);
        }
    }
}
