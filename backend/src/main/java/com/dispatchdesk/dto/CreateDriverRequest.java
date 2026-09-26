package com.dispatchdesk.dto;

public class CreateDriverRequest {
    private String phone;
    private String vehicle;
    private String licenseNumber;
    private String status;

    public CreateDriverRequest() {}

    public CreateDriverRequest(String phone, String vehicle, String licenseNumber, String status) {
        this.phone = phone;
        this.vehicle = vehicle;
        this.licenseNumber = licenseNumber;
        this.status = status;
    }

    public static CreateDriverRequestBuilder builder() {
        return new CreateDriverRequestBuilder();
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static class CreateDriverRequestBuilder {
        private String phone;
        private String vehicle;
        private String licenseNumber;
        private String status;

        public CreateDriverRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public CreateDriverRequestBuilder vehicle(String vehicle) { this.vehicle = vehicle; return this; }
        public CreateDriverRequestBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public CreateDriverRequestBuilder status(String status) { this.status = status; return this; }

        public CreateDriverRequest build() {
            return new CreateDriverRequest(phone, vehicle, licenseNumber, status);
        }
    }
}
