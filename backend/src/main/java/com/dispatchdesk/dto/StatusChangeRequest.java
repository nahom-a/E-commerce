package com.dispatchdesk.dto;

public class StatusChangeRequest {
    private String newStatus;
    private String note;

    public StatusChangeRequest() {}

    public StatusChangeRequest(String newStatus, String note) {
        this.newStatus = newStatus;
        this.note = note;
    }

    public static StatusChangeRequestBuilder builder() {
        return new StatusChangeRequestBuilder();
    }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public static class StatusChangeRequestBuilder {
        private String newStatus;
        private String note;

        public StatusChangeRequestBuilder newStatus(String newStatus) { this.newStatus = newStatus; return this; }
        public StatusChangeRequestBuilder note(String note) { this.note = note; return this; }

        public StatusChangeRequest build() {
            return new StatusChangeRequest(newStatus, note);
        }
    }
}
