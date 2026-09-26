package com.dispatchdesk.dto;

import com.dispatchdesk.enums.Priority;

import java.time.LocalDateTime;

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

    public CreateDeliveryRequest() {}

    public CreateDeliveryRequest(Long customerId, String recipientName, String recipientPhone, String address,
                                 String city, String packageDescription, String packageSize, Priority priority,
                                 LocalDateTime scheduledDate, Long driverId) {
        this.customerId = customerId;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.address = address;
        this.city = city;
        this.packageDescription = packageDescription;
        this.packageSize = packageSize;
        this.priority = priority;
        this.scheduledDate = scheduledDate;
        this.driverId = driverId;
    }

    public static CreateDeliveryRequestBuilder builder() {
        return new CreateDeliveryRequestBuilder();
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

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

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public static class CreateDeliveryRequestBuilder {
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

        public CreateDeliveryRequestBuilder customerId(Long customerId) { this.customerId = customerId; return this; }
        public CreateDeliveryRequestBuilder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public CreateDeliveryRequestBuilder recipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; return this; }
        public CreateDeliveryRequestBuilder address(String address) { this.address = address; return this; }
        public CreateDeliveryRequestBuilder city(String city) { this.city = city; return this; }
        public CreateDeliveryRequestBuilder packageDescription(String packageDescription) { this.packageDescription = packageDescription; return this; }
        public CreateDeliveryRequestBuilder packageSize(String packageSize) { this.packageSize = packageSize; return this; }
        public CreateDeliveryRequestBuilder priority(Priority priority) { this.priority = priority; return this; }
        public CreateDeliveryRequestBuilder scheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public CreateDeliveryRequestBuilder driverId(Long driverId) { this.driverId = driverId; return this; }

        public CreateDeliveryRequest build() {
            return new CreateDeliveryRequest(customerId, recipientName, recipientPhone, address, city, packageDescription, packageSize, priority, scheduledDate, driverId);
        }
    }
}
