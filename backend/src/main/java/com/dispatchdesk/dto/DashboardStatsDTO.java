package com.dispatchdesk.dto;

import java.util.List;

public class DashboardStatsDTO {
    private long activeDeliveries;
    private long pendingAssignment;
    private long outForDelivery;
    private long deliveredToday;
    private long failedToday;
    private List<DeliveryCountDTO> deliveriesLast7Days;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long activeDeliveries, long pendingAssignment, long outForDelivery,
                             long deliveredToday, long failedToday, List<DeliveryCountDTO> deliveriesLast7Days) {
        this.activeDeliveries = activeDeliveries;
        this.pendingAssignment = pendingAssignment;
        this.outForDelivery = outForDelivery;
        this.deliveredToday = deliveredToday;
        this.failedToday = failedToday;
        this.deliveriesLast7Days = deliveriesLast7Days;
    }

    public static DashboardStatsDTOBuilder builder() {
        return new DashboardStatsDTOBuilder();
    }

    public long getActiveDeliveries() { return activeDeliveries; }
    public void setActiveDeliveries(long activeDeliveries) { this.activeDeliveries = activeDeliveries; }

    public long getPendingAssignment() { return pendingAssignment; }
    public void setPendingAssignment(long pendingAssignment) { this.pendingAssignment = pendingAssignment; }

    public long getOutForDelivery() { return outForDelivery; }
    public void setOutForDelivery(long outForDelivery) { this.outForDelivery = outForDelivery; }

    public long getDeliveredToday() { return deliveredToday; }
    public void setDeliveredToday(long deliveredToday) { this.deliveredToday = deliveredToday; }

    public long getFailedToday() { return failedToday; }
    public void setFailedToday(long failedToday) { this.failedToday = failedToday; }

    public List<DeliveryCountDTO> getDeliveriesLast7Days() { return deliveriesLast7Days; }
    public void setDeliveriesLast7Days(List<DeliveryCountDTO> deliveriesLast7Days) { this.deliveriesLast7Days = deliveriesLast7Days; }

    public static class DeliveryCountDTO {
        private String date;
        private long count;

        public DeliveryCountDTO() {}

        public DeliveryCountDTO(String date, long count) {
            this.date = date;
            this.count = count;
        }

        public static DeliveryCountDTOBuilder builder() {
            return new DeliveryCountDTOBuilder();
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }

        public static class DeliveryCountDTOBuilder {
            private String date;
            private long count;

            public DeliveryCountDTOBuilder date(String date) { this.date = date; return this; }
            public DeliveryCountDTOBuilder count(long count) { this.count = count; return this; }

            public DeliveryCountDTO build() {
                return new DeliveryCountDTO(date, count);
            }
        }
    }

    public static class DashboardStatsDTOBuilder {
        private long activeDeliveries;
        private long pendingAssignment;
        private long outForDelivery;
        private long deliveredToday;
        private long failedToday;
        private List<DeliveryCountDTO> deliveriesLast7Days;

        public DashboardStatsDTOBuilder activeDeliveries(long activeDeliveries) { this.activeDeliveries = activeDeliveries; return this; }
        public DashboardStatsDTOBuilder pendingAssignment(long pendingAssignment) { this.pendingAssignment = pendingAssignment; return this; }
        public DashboardStatsDTOBuilder outForDelivery(long outForDelivery) { this.outForDelivery = outForDelivery; return this; }
        public DashboardStatsDTOBuilder deliveredToday(long deliveredToday) { this.deliveredToday = deliveredToday; return this; }
        public DashboardStatsDTOBuilder failedToday(long failedToday) { this.failedToday = failedToday; return this; }
        public DashboardStatsDTOBuilder deliveriesLast7Days(List<DeliveryCountDTO> deliveriesLast7Days) { this.deliveriesLast7Days = deliveriesLast7Days; return this; }

        public DashboardStatsDTO build() {
            return new DashboardStatsDTO(activeDeliveries, pendingAssignment, outForDelivery, deliveredToday, failedToday, deliveriesLast7Days);
        }
    }
}
