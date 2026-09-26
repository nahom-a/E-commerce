package com.dispatchdesk.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String actor;

    @Column(nullable = false)
    private String action;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ActivityLog() {}

    public ActivityLog(Long id, String actor, String action, String entityType, Long entityId, String description, LocalDateTime createdAt) {
        this.id = id;
        this.actor = actor;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.createdAt = createdAt;
    }

    public static ActivityLogBuilder builder() {
        return new ActivityLogBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ActivityLogBuilder {
        private Long id;
        private String actor;
        private String action;
        private String entityType;
        private Long entityId;
        private String description;
        private LocalDateTime createdAt;

        public ActivityLogBuilder id(Long id) { this.id = id; return this; }
        public ActivityLogBuilder actor(String actor) { this.actor = actor; return this; }
        public ActivityLogBuilder action(String action) { this.action = action; return this; }
        public ActivityLogBuilder entityType(String entityType) { this.entityType = entityType; return this; }
        public ActivityLogBuilder entityId(Long entityId) { this.entityId = entityId; return this; }
        public ActivityLogBuilder description(String description) { this.description = description; return this; }
        public ActivityLogBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ActivityLog build() {
            return new ActivityLog(id, actor, action, entityType, entityId, description, createdAt);
        }
    }
}
