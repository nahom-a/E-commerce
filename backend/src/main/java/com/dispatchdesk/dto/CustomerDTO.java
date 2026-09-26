package com.dispatchdesk.dto;

import java.time.LocalDateTime;

public class CustomerDTO {
    private Long id;
    private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private String notes;
    private LocalDateTime createdAt;

    public CustomerDTO() {}

    public CustomerDTO(Long id, String name, String contactPerson, String phone, String email, String address, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contactPerson = contactPerson;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public static CustomerDTOBuilder builder() {
        return new CustomerDTOBuilder();
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

    public static class CustomerDTOBuilder {
        private Long id;
        private String name;
        private String contactPerson;
        private String phone;
        private String email;
        private String address;
        private String notes;
        private LocalDateTime createdAt;

        public CustomerDTOBuilder id(Long id) { this.id = id; return this; }
        public CustomerDTOBuilder name(String name) { this.name = name; return this; }
        public CustomerDTOBuilder contactPerson(String contactPerson) { this.contactPerson = contactPerson; return this; }
        public CustomerDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public CustomerDTOBuilder email(String email) { this.email = email; return this; }
        public CustomerDTOBuilder address(String address) { this.address = address; return this; }
        public CustomerDTOBuilder notes(String notes) { this.notes = notes; return this; }
        public CustomerDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CustomerDTO build() {
            return new CustomerDTO(id, name, contactPerson, phone, email, address, notes, createdAt);
        }
    }
}
