package com.dispatchdesk.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "contact_person")
    private String contactPerson;

    private String phone;
    private String email;
    private String address;
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Customer() {}

    public Customer(Long id, String name, String contactPerson, String phone, String email, String address, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contactPerson = contactPerson;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public static CustomerBuilder builder() {
        return new CustomerBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class CustomerBuilder {
        private Long id;
        private String name;
        private String contactPerson;
        private String phone;
        private String email;
        private String address;
        private String notes;
        private LocalDateTime createdAt;

        public CustomerBuilder id(Long id) { this.id = id; return this; }
        public CustomerBuilder name(String name) { this.name = name; return this; }
        public CustomerBuilder contactPerson(String contactPerson) { this.contactPerson = contactPerson; return this; }
        public CustomerBuilder phone(String phone) { this.phone = phone; return this; }
        public CustomerBuilder email(String email) { this.email = email; return this; }
        public CustomerBuilder address(String address) { this.address = address; return this; }
        public CustomerBuilder notes(String notes) { this.notes = notes; return this; }
        public CustomerBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Customer build() {
            return new Customer(id, name, contactPerson, phone, email, address, notes, createdAt);
        }
    }
}
