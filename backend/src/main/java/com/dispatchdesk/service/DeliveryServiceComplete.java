package com.dispatchdesk.service;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.entity.*;
import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.DriverStatus;
import com.dispatchdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeliveryServiceComplete {

    @Autowired private DeliveryRepository deliveryRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private DeliveryStatusHistoryRepository historyRepository;
    @Autowired private ActivityLogRepository activityLogRepository;
    @Autowired private UserRepository userRepository;

    public PageResponseDTO<DeliveryDTO> getAllDeliveries(String search, String status, Long driverId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Delivery> deliveries;
        if (search != null && !search.isEmpty()) {
            deliveries = deliveryRepository.search(search, pageable);
        } else if (status != null && !status.isEmpty()) {
            deliveries = deliveryRepository.findByStatus(DeliveryStatus.valueOf(status), pageable);
        } else if (driverId != null) {
            deliveries = deliveryRepository.findByDriverId(driverId, pageable);
        } else {
            deliveries = deliveryRepository.findAll(pageable);
        }
        return new PageResponseDTO<>(mapToDTOs(deliveries.getContent()), deliveries.getNumber(), deliveries.getSize(), deliveries.getTotalElements(), deliveries.getTotalPages());
    }

    public DeliveryDTO getDelivery(Long id) {
        Delivery d = deliveryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        return mapToDTO(d);
    }

    public DeliveryDTO createDelivery(CreateDeliveryRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Delivery delivery = Delivery.builder()
            .deliveryNumber(generateDeliveryNumber())
            .customer(customer)
            .recipientName(request.getRecipientName())
            .recipientPhone(request.getRecipientPhone())
            .address(request.getAddress())
            .city(request.getCity())
            .packageDescription(request.getPackageDescription())
            .packageSize(request.getPackageSize() != null ? com.dispatchdesk.enums.PackageSize.valueOf(request.getPackageSize()) : com.dispatchdesk.enums.PackageSize.MEDIUM)
            .priority(request.getPriority() != null ? request.getPriority() : Priority.NORMAL)
            .status(DeliveryStatus.PENDING)
            .scheduledDate(request.getScheduledDate())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        Delivery saved = deliveryRepository.save(delivery);
        addHistory(saved, null, DeliveryStatus.PENDING.name(), 1L, "Delivery created");
        addActivity("System", "CREATE_DELIVERY", "DELIVERY", saved.getId(), "Delivery " + saved.getDeliveryNumber() + " created");
        return mapToDTO(saved);
    }

    public DeliveryDTO updateDelivery(Long id, CreateDeliveryRequest request) {
        Delivery d = deliveryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        d.setRecipientName(request.getRecipientName());
        d.setRecipientPhone(request.getRecipientPhone());
        d.setAddress(request.getAddress());
        d.setCity(request.getCity());
        d.setPackageDescription(request.getPackageDescription());
        d.setPriority(request.getPriority());
        d.setScheduledDate(request.getScheduledDate());
        d.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(deliveryRepository.save(d));
    }

    public DeliveryDTO assignDriver(Long deliveryId, AssignDriverRequest request) {
        Delivery d = deliveryRepository.findById(deliveryId).orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        Driver driver = driverRepository.findById(request.getDriverId()).orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        if (driver.getStatus() == DriverStatus.OFFLINE) throw new AccessDeniedException("Cannot assign an offline driver");
        DeliveryStatus oldStatus = d.getStatus();
        d.setDriver(driver);
        if (oldStatus == DeliveryStatus.PENDING) d.setStatus(DeliveryStatus.ASSIGNED);
        d.setUpdatedAt(LocalDateTime.now());
        Delivery saved = deliveryRepository.save(d);
        addHistory(saved, oldStatus.name(), saved.getStatus().name(), 1L, "Driver assigned");
        addActivity("Dispatcher", "ASSIGN_DRIVER", "DELIVERY", saved.getId(), "Driver assigned to " + saved.getDeliveryNumber());
        return mapToDTO(saved);
    }

    public DeliveryDTO changeStatus(Long deliveryId, StatusChangeRequest request) {
        Delivery d = deliveryRepository.findById(deliveryId).orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        DeliveryStatus newStatus = DeliveryStatus.valueOf(request.getNewStatus());
        DeliveryStatus oldStatus = d.getStatus();
        if (!isValidTransition(oldStatus, newStatus)) throw new InvalidStatusTransitionException("Cannot change status from " + oldStatus + " to " + newStatus);
        d.setStatus(newStatus);
        d.setUpdatedAt(LocalDateTime.now());
        Delivery saved = deliveryRepository.save(d);
        addHistory(saved, oldStatus.name(), newStatus.name(), 1L, "Status changed");
        addActivity("Dispatcher", "CHANGE_STATUS", "DELIVERY", saved.getId(), saved.getDeliveryNumber() + " changed to " + newStatus);
        return mapToDTO(saved);
    }

    public void cancelDelivery(Long deliveryId) {
        Delivery d = deliveryRepository.findById(deliveryId).orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
        if (d.getStatus() == DeliveryStatus.PENDING || d.getStatus() == DeliveryStatus.ASSIGNED) {
            DeliveryStatus oldStatus = d.getStatus();
            d.setStatus(DeliveryStatus.CANCELLED);
            d.setUpdatedAt(LocalDateTime.now());
            deliveryRepository.save(d);
            addHistory(d, oldStatus.name(), DeliveryStatus.CANCELLED.name(), 1L, "Delivery cancelled");
            addActivity("Dispatcher", "CANCEL", "DELIVERY", d.getId(), d.getDeliveryNumber() + " cancelled");
        } else throw new InvalidStatusTransitionException("Cannot cancel delivery in status " + d.getStatus());
    }

    public List<DeliveryDTO> getDriverDeliveries(Long driverId) {
        return deliveryRepository.findByDriverId(driverId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<DeliveryStatusHistory> getDeliveryHistory(Long deliveryId) {
        return historyRepository.findByDeliveryId(deliveryId);
    }

    private boolean isValidTransition(DeliveryStatus from, DeliveryStatus to) {
        switch (from) {
            case PENDING: return to == DeliveryStatus.ASSIGNED || to == DeliveryStatus.CANCELLED;
            case ASSIGNED: return to == DeliveryStatus.PICKED_UP || to == DeliveryStatus.CANCELLED;
            case PICKED_UP: return to == DeliveryStatus.OUT_FOR_DELIVERY;
            case OUT_FOR_DELIVERY: return to == DeliveryStatus.DELIVERED || to == DeliveryStatus.FAILED;
            case FAILED: return to == DeliveryStatus.OUT_FOR_DELIVERY;
            default: return false;
        }
    }

    private String generateDeliveryNumber() {
        return "DLV-" + String.format("%04d", 1001 + deliveryRepository.count().intValue());
    }

    private void addHistory(Delivery d, String oldStatus, String newStatus, Long changedBy, String note) {
        historyRepository.save(DeliveryStatusHistory.builder().delivery(d).oldStatus(oldStatus).newStatus(newStatus).changedBy(changedBy != null ? userRepository.findById(changedBy).orElse(null) : null).note(note).build());
    }

    private void addActivity(String actor, String action, String entityType, Long entityId, String description) {
        activityLogRepository.save(ActivityLog.builder().actor(actor).action(action).entityType(entityType).entityId(entityId).description(description).build());
    }

    private DeliveryDTO mapToDTO(Delivery d) {
        return DeliveryDTO.builder()
            .id(d.getId()).deliveryNumber(d.getDeliveryNumber())
            .customerId(d.getCustomer() != null ? d.getCustomer().getId() : null)
            .customerName(d.getCustomer() != null ? d.getCustomer().getName() : null)
            .recipientName(d.getRecipientName()).recipientPhone(d.getRecipientPhone())
            .address(d.getAddress()).city(d.getCity())
            .packageDescription(d.getPackageDescription())
            .packageSize(d.getPackageSize() != null ? d.getPackageSize().name() : null)
            .priority(d.getPriority()).status(d.getStatus())
            .driverId(d.getDriver() != null ? d.getDriver().getId() : null)
            .scheduledDate(d.getScheduledDate())
            .createdAt(d.getCreatedAt()).updatedAt(d.getUpdatedAt())
            .build();
    }

    private List<DeliveryDTO> mapToDTOs(List<Delivery> deliveries) {
        return deliveries.stream().map(this::mapToDTO).collect(java.util.stream.Collectors.toList());
    }
}
