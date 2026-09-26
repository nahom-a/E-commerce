package com.dispatchdesk.service;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.entity.*;
import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.DriverStatus;
import com.dispatchdesk.enums.PackageSize;
import com.dispatchdesk.enums.Priority;
import com.dispatchdesk.exception.*;
import com.dispatchdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Delivery> deliveries;

        if (search != null && !search.trim().isEmpty()) {
            deliveries = deliveryRepository.search(search.trim(), pageable);
        } else if (status != null && !status.trim().isEmpty() && driverId != null) {
            deliveries = deliveryRepository.findByStatusAndDriverId(DeliveryStatus.valueOf(status.trim()), driverId, pageable);
        } else if (status != null && !status.trim().isEmpty()) {
            deliveries = deliveryRepository.findByStatus(DeliveryStatus.valueOf(status.trim()), pageable);
        } else if (driverId != null) {
            deliveries = deliveryRepository.findByDriverId(driverId, pageable);
        } else {
            deliveries = deliveryRepository.findAll(pageable);
        }

        return new PageResponseDTO<>(
            mapToDTOs(deliveries.getContent()),
            deliveries.getNumber(),
            deliveries.getSize(),
            deliveries.getTotalElements(),
            deliveries.getTotalPages()
        );
    }

    public DeliveryDTO getDelivery(Long id) {
        Delivery d = deliveryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
        return mapToDTO(d);
    }

    public DeliveryDTO createDelivery(CreateDeliveryRequest request) {
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));
        }

        Driver driver = null;
        DeliveryStatus initialStatus = DeliveryStatus.PENDING;
        if (request.getDriverId() != null) {
            driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));
            if (driver.getStatus() == DriverStatus.OFFLINE) {
                throw new AccessDeniedException("Cannot assign an offline driver");
            }
            initialStatus = DeliveryStatus.ASSIGNED;
        }

        PackageSize size = PackageSize.MEDIUM;
        if (request.getPackageSize() != null && !request.getPackageSize().trim().isEmpty()) {
            try {
                size = PackageSize.valueOf(request.getPackageSize().trim());
            } catch (IllegalArgumentException ignored) {}
        }

        Priority priority = request.getPriority() != null ? request.getPriority() : Priority.NORMAL;

        Delivery delivery = Delivery.builder()
            .deliveryNumber(generateDeliveryNumber())
            .customer(customer)
            .recipientName(request.getRecipientName())
            .recipientPhone(request.getRecipientPhone())
            .address(request.getAddress())
            .city(request.getCity())
            .packageDescription(request.getPackageDescription())
            .packageSize(size)
            .priority(priority)
            .status(initialStatus)
            .driver(driver)
            .scheduledDate(request.getScheduledDate())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        Delivery saved = deliveryRepository.save(delivery);
        addHistory(saved, null, initialStatus.name(), 1L, "Delivery created");
        addActivity("System", "CREATE_DELIVERY", "DELIVERY", saved.getId(), "Delivery " + saved.getDeliveryNumber() + " created");
        return mapToDTO(saved);
    }

    public DeliveryDTO updateDelivery(Long id, CreateDeliveryRequest request) {
        Delivery d = deliveryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));
            d.setCustomer(customer);
        }

        if (request.getRecipientName() != null) d.setRecipientName(request.getRecipientName());
        if (request.getRecipientPhone() != null) d.setRecipientPhone(request.getRecipientPhone());
        if (request.getAddress() != null) d.setAddress(request.getAddress());
        if (request.getCity() != null) d.setCity(request.getCity());
        if (request.getPackageDescription() != null) d.setPackageDescription(request.getPackageDescription());
        if (request.getPriority() != null) d.setPriority(request.getPriority());
        if (request.getPackageSize() != null) {
            try {
                d.setPackageSize(PackageSize.valueOf(request.getPackageSize()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (request.getScheduledDate() != null) d.setScheduledDate(request.getScheduledDate());
        d.setUpdatedAt(LocalDateTime.now());

        Delivery updated = deliveryRepository.save(d);
        addActivity("Dispatcher", "UPDATE_DELIVERY", "DELIVERY", updated.getId(), "Delivery " + updated.getDeliveryNumber() + " updated");
        return mapToDTO(updated);
    }

    public DeliveryDTO assignDriver(Long deliveryId, AssignDriverRequest request) {
        Delivery d = deliveryRepository.findById(deliveryId)
            .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        Driver driver = driverRepository.findById(request.getDriverId())
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));

        if (driver.getStatus() == DriverStatus.OFFLINE) {
            throw new AccessDeniedException("Cannot assign an offline driver");
        }

        DeliveryStatus oldStatus = d.getStatus();
        d.setDriver(driver);
        if (oldStatus == DeliveryStatus.PENDING) {
            d.setStatus(DeliveryStatus.ASSIGNED);
        }
        d.setUpdatedAt(LocalDateTime.now());
        Delivery saved = deliveryRepository.save(d);

        addHistory(saved, oldStatus != null ? oldStatus.name() : null, saved.getStatus().name(), 1L, "Driver assigned");
        addActivity("Dispatcher", "ASSIGN_DRIVER", "DELIVERY", saved.getId(), "Driver assigned to " + saved.getDeliveryNumber());
        return mapToDTO(saved);
    }

    public DeliveryDTO changeStatus(Long deliveryId, StatusChangeRequest request) {
        Delivery d = deliveryRepository.findById(deliveryId)
            .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        DeliveryStatus newStatus = DeliveryStatus.valueOf(request.getNewStatus());
        DeliveryStatus oldStatus = d.getStatus();

        if (!isValidTransition(oldStatus, newStatus)) {
            throw new InvalidStatusTransitionException("Cannot change status from " + oldStatus + " to " + newStatus);
        }

        d.setStatus(newStatus);
        d.setUpdatedAt(LocalDateTime.now());
        Delivery saved = deliveryRepository.save(d);

        String note = request.getNote() != null && !request.getNote().trim().isEmpty() ? request.getNote().trim() : "Status changed to " + newStatus;
        addHistory(saved, oldStatus.name(), newStatus.name(), 1L, note);
        addActivity("Dispatcher", "CHANGE_STATUS", "DELIVERY", saved.getId(), saved.getDeliveryNumber() + " changed to " + newStatus);
        return mapToDTO(saved);
    }

    public void cancelDelivery(Long deliveryId) {
        Delivery d = deliveryRepository.findById(deliveryId)
            .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + deliveryId));
        if (d.getStatus() == DeliveryStatus.PENDING || d.getStatus() == DeliveryStatus.ASSIGNED) {
            DeliveryStatus oldStatus = d.getStatus();
            d.setStatus(DeliveryStatus.CANCELLED);
            d.setUpdatedAt(LocalDateTime.now());
            deliveryRepository.save(d);
            addHistory(d, oldStatus.name(), DeliveryStatus.CANCELLED.name(), 1L, "Delivery cancelled");
            addActivity("Dispatcher", "CANCEL", "DELIVERY", d.getId(), d.getDeliveryNumber() + " cancelled");
        } else {
            throw new InvalidStatusTransitionException("Cannot cancel delivery in status " + d.getStatus());
        }
    }

    public List<DeliveryDTO> getDriverDeliveries(Long driverId) {
        return deliveryRepository.findByDriverId(driverId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<DeliveryStatusHistory> getDeliveryHistory(Long deliveryId) {
        return historyRepository.findByDeliveryIdOrderByChangedAtAsc(deliveryId);
    }

    public boolean isValidTransition(DeliveryStatus from, DeliveryStatus to) {
        if (from == null || to == null) return false;
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
        return "DLV-" + String.format("%04d", 1001 + Math.toIntExact(deliveryRepository.count()));
    }

    private void addHistory(Delivery d, String oldStatus, String newStatus, Long changedBy, String note) {
        User user = changedBy != null ? userRepository.findById(changedBy).orElse(null) : null;
        historyRepository.save(new DeliveryStatusHistory(null, d, oldStatus, newStatus, user, LocalDateTime.now(), note));
    }

    private void addActivity(String actor, String action, String entityType, Long entityId, String description) {
        activityLogRepository.save(new ActivityLog(null, actor, action, entityType, entityId, description, LocalDateTime.now()));
    }

    private DeliveryDTO mapToDTO(Delivery d) {
        String driverName = null;
        if (d.getDriver() != null) {
            if (d.getDriver().getUserId() != null) {
                driverName = userRepository.findById(d.getDriver().getUserId())
                    .map(User::getName)
                    .orElse("Driver #" + d.getDriver().getId());
            } else {
                driverName = "Driver #" + d.getDriver().getId();
            }
        }

        return DeliveryDTO.builder()
            .id(d.getId())
            .deliveryNumber(d.getDeliveryNumber())
            .customerId(d.getCustomer() != null ? d.getCustomer().getId() : null)
            .customerName(d.getCustomer() != null ? d.getCustomer().getName() : null)
            .recipientName(d.getRecipientName())
            .recipientPhone(d.getRecipientPhone())
            .address(d.getAddress())
            .city(d.getCity())
            .packageDescription(d.getPackageDescription())
            .packageSize(d.getPackageSize() != null ? d.getPackageSize().name() : null)
            .priority(d.getPriority())
            .status(d.getStatus())
            .driverId(d.getDriver() != null ? d.getDriver().getId() : null)
            .driverName(driverName)
            .scheduledDate(d.getScheduledDate())
            .createdAt(d.getCreatedAt())
            .updatedAt(d.getUpdatedAt())
            .build();
    }

    private List<DeliveryDTO> mapToDTOs(List<Delivery> deliveries) {
        return deliveries.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
