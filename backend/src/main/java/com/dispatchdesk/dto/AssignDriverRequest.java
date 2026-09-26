package com.dispatchdesk.dto;

public class AssignDriverRequest {
    private Long driverId;

    public AssignDriverRequest() {}

    public AssignDriverRequest(Long driverId) {
        this.driverId = driverId;
    }

    public static AssignDriverRequestBuilder builder() {
        return new AssignDriverRequestBuilder();
    }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public static class AssignDriverRequestBuilder {
        private Long driverId;

        public AssignDriverRequestBuilder driverId(Long driverId) { this.driverId = driverId; return this; }
        public AssignDriverRequest build() { return new AssignDriverRequest(driverId); }
    }
}
