package com.dispatchdesk.dto;

import com.dispatchdesk.enums.DriverStatus;

public class DriverDTO {
    private Long id;
    private String phone;
    private String vehicle;
    private String licenseNumber;
    private DriverStatus status;
    private String userName;
    private int activeDeliveries;

    public DriverDTO() {}

    public DriverDTO(Long id, String phone, String vehicle, String licenseNumber, DriverStatus status, String userName, int activeDeliveries) {
        this.id = id;
        this.phone = phone;
        this.vehicle = vehicle;
        this.licenseNumber = licenseNumber;
        this.status = status;
        this.userName = userName;
        this.activeDeliveries = activeDeliveries;
    }

    public static DriverDTOBuilder builder() {
        return new DriverDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public DriverStatus getStatus() { return status; }
    public void setStatus(DriverStatus status) { this.status = status; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public int getActiveDeliveries() { return activeDeliveries; }
    public void setActiveDeliveries(int activeDeliveries) { this.activeDeliveries = activeDeliveries; }

    public static class DriverDTOBuilder {
        private Long id;
        private String phone;
        private String vehicle;
        private String licenseNumber;
        private DriverStatus status;
        private String userName;
        private int activeDeliveries;

        public DriverDTOBuilder id(Long id) { this.id = id; return this; }
        public DriverDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public DriverDTOBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public DriverDTOBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DriverDTOBuilder status(DriverStatus status) { this.status = status; return this; }
        public DriverDTOBuilder userName(String userName) { this.userName = userName; return this; }
        public DriverDTOBuilder activeDeliveries(int activeDeliveries) { this.activeDeliveries = activeDeliveries; return this; }

        public DriverDTO build() {
            return new DriverDTO(id, phone, vehicle, licenseNumber, status, userName, activeDeliveries);
        }
    }
}
