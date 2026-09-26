package com.dispatchdesk.entity;

import com.dispatchdesk.enums.DriverStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
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
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Driver() {}

    public Driver(Long id, Long userId, String phone, String vehicle, String licenseNumber, DriverStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.phone = phone;
        this.vehicle = vehicle;
        this.licenseNumber = licenseNumber;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static DriverBuilder builder() {
        return new DriverBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public DriverStatus getStatus() { return status; }
    public void setStatus(DriverStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class DriverBuilder {
        private Long id;
        private Long userId;
        private String phone;
        private String vehicle;
        private String licenseNumber;
        private DriverStatus status;
        private LocalDateTime createdAt;

        public DriverBuilder id(Long id) { this.id = id; return this; }
        public DriverBuilder userId(Long userId) { this.userId = userId; return this; }
        public DriverBuilder phone(String phone) { this.phone = phone; return this; }
        public DriverBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public DriverBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DriverBuilder status(DriverStatus status) { this.status = status; return this; }
        public DriverBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Driver build() {
            return new Driver(id, userId, phone, vehicle, licenseNumber, status, createdAt);
        }
    }
}
