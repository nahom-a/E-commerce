package com.dispatchdesk.dto;

import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.Priority;

import java.time.LocalDateTime;

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

    public DeliveryDTO() {}

    public DeliveryDTO(Long id, String deliveryNumber, Long customerId, String customerName,
                       String recipientName, String recipientPhone, String address, String city,
                       String packageDescription, String packageSize, Priority priority,
                       DeliveryStatus status, Long driverId, String driverName,
                       LocalDateTime scheduledDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.deliveryNumber = deliveryNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.address = address;
        this.city = city;
        this.packageDescription = packageDescription;
        this.packageSize = packageSize;
        this.priority = priority;
        this.status = status;
        this.driverId = driverId;
        this.driverName = driverName;
        this.scheduledDate = scheduledDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DeliveryDTOBuilder builder() {
        return new DeliveryDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeliveryNumber() { return deliveryNumber; }
    public void setDeliveryNumber(String deliveryNumber) { this.deliveryNumber = deliveryNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

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

    public String getPackageSize() { return packageSize; }
    public void setPackageSize(String packageSize) { this.packageSize = packageSize; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class DeliveryDTOBuilder {
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

        public DeliveryDTOBuilder id(Long id) { this.id = id; return this; }
        public DeliveryDTOBuilder deliveryNumber(String deliveryNumber) { this.deliveryNumber = deliveryNumber; return this; }
        public DeliveryDTOBuilder customerId(Long customerId) { this.customerId = customerId; return this; }
        public DeliveryDTOBuilder customerName(String customerName) { this.customerName = customerName; return this; }
        public DeliveryDTOBuilder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public DeliveryDTOBuilder recipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; return this; }
        public DeliveryDTOBuilder address(String address) { this.address = address; return this; }
        public DeliveryDTOBuilder city(String city) { this.city = city; return this; }
        public DeliveryDTOBuilder packageDescription(String packageDescription) { this.packageDescription = packageDescription; return this; }
        public DeliveryDTOBuilder packageSize(String packageSize) { this.packageSize = packageSize; return this; }
        public DeliveryDTOBuilder priority(Priority priority) { this.priority = priority; return this; }
        public DeliveryDTOBuilder status(DeliveryStatus status) { this.status = status; return this; }
        public DeliveryDTOBuilder driverId(Long driverId) { this.driverId = driverId; return this; }
        public DeliveryDTOBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public DeliveryDTOBuilder scheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public DeliveryDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DeliveryDTOBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public DeliveryDTO build() {
            return new DeliveryDTO(id, deliveryNumber, customerId, customerName, recipientName, recipientPhone,
                    address, city, packageDescription, packageSize, priority, status, driverId, driverName,
                    scheduledDate, createdAt, updatedAt);
        }
    }
}
