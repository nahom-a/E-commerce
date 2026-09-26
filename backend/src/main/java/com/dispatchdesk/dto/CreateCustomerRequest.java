package com.dispatchdesk.dto;

public class CreateCustomerRequest {
    private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private String notes;

    public CreateCustomerRequest() {}

    public CreateCustomerRequest(String name, String contactPerson, String phone, String email, String address, String notes) {
        this.name = name;
        this.contactPerson = contactPerson;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.notes = notes;
    }

    public static CreateCustomerRequestBuilder builder() {
        return new CreateCustomerRequestBuilder();
    }

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

    public static class CreateCustomerRequestBuilder {
        private String name;
        private String contactPerson;
        private String phone;
        private String email;
        private String address;
        private String notes;

        public CreateCustomerRequestBuilder name(String name) { this.name = name; return this; }
        public CreateCustomerRequestBuilder contactPerson(String contactPerson) { this.contactPerson = contactPerson; return this; }
        public CreateCustomerRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public CreateCustomerRequestBuilder email(String email) { this.email = email; return this; }
        public CreateCustomerRequestBuilder address(String address) { this.address = address; return this; }
        public CreateCustomerRequestBuilder notes(String notes) { this.notes = notes; return this; }

        public CreateCustomerRequest build() {
            return new CreateCustomerRequest(name, contactPerson, phone, email, address, notes);
        }
    }
}
