package com.dispatchdesk.service;

import com.dispatchdesk.dto.CreateDriverRequest;
import com.dispatchdesk.dto.DeliveryDTO;
import com.dispatchdesk.dto.DriverDTO;
import com.dispatchdesk.dto.PageResponseDTO;
import com.dispatchdesk.entity.Delivery;
import com.dispatchdesk.entity.Driver;
import com.dispatchdesk.entity.User;
import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.DriverStatus;
import com.dispatchdesk.exception.ResourceNotFoundException;
import com.dispatchdesk.repository.DeliveryRepository;
import com.dispatchdesk.repository.DriverRepository;
import com.dispatchdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverService {

    @Autowired private DriverRepository driverRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DeliveryRepository deliveryRepository;

    private static final List<DeliveryStatus> ACTIVE_DELIVERY_STATUSES = Arrays.asList(
        DeliveryStatus.ASSIGNED,
        DeliveryStatus.PICKED_UP,
        DeliveryStatus.OUT_FOR_DELIVERY
    );

    public PageResponseDTO<DriverDTO> getAllDrivers(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Driver> drivers;
        if (status != null && !status.isEmpty()) {
            drivers = driverRepository.findByStatus(DriverStatus.valueOf(status), pageable);
        } else {
            drivers = driverRepository.findAll(pageable);
        }
        return new PageResponseDTO<>(
            mapToDTOs(drivers.getContent()),
            drivers.getNumber(),
            drivers.getSize(),
            drivers.getTotalElements(),
            drivers.getTotalPages()
        );
    }

    public DriverDTO getDriver(Long id) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        return mapToDTO(driver);
    }

    public DriverDTO createDriver(CreateDriverRequest request) {
        Driver driver = Driver.builder()
            .phone(request.getPhone())
            .vehicle(request.getVehicle())
            .licenseNumber(request.getLicenseNumber())
            .status(request.getStatus() != null ? DriverStatus.valueOf(request.getStatus()) : DriverStatus.AVAILABLE)
            .build();
        return mapToDTO(driverRepository.save(driver));
    }

    public DriverDTO updateDriver(Long id, CreateDriverRequest request) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        driver.setPhone(request.getPhone());
        driver.setVehicle(request.getVehicle());
        driver.setLicenseNumber(request.getLicenseNumber());
        if (request.getStatus() != null) {
            driver.setStatus(DriverStatus.valueOf(request.getStatus()));
        }
        return mapToDTO(driverRepository.save(driver));
    }

    public List<DeliveryDTO> getDriverDeliveries(Long driverId) {
        driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        return deliveryRepository.findByDriverId(driverId).stream().map(this::mapDeliveryDTO).collect(Collectors.toList());
    }

    private DriverDTO mapToDTO(Driver d) {
        DriverDTO dto = new DriverDTO();
        dto.setId(d.getId());
        dto.setPhone(d.getPhone());
        dto.setVehicle(d.getVehicle());
        dto.setLicenseNumber(d.getLicenseNumber());
        dto.setStatus(d.getStatus());

        if (d.getUserId() != null) {
            userRepository.findById(d.getUserId()).ifPresent(u -> dto.setUserName(u.getName()));
        } else {
            dto.setUserName("Driver #" + d.getId());
        }

        int activeCount = deliveryRepository.countActiveByDriverId(d.getId(), ACTIVE_DELIVERY_STATUSES);
        dto.setActiveDeliveries(activeCount);
        return dto;
    }

    private DeliveryDTO mapDeliveryDTO(Delivery d) {
        return DeliveryDTO.builder()
            .id(d.getId())
            .deliveryNumber(d.getDeliveryNumber())
            .recipientName(d.getRecipientName())
            .recipientPhone(d.getRecipientPhone())
            .address(d.getAddress())
            .city(d.getCity())
            .packageDescription(d.getPackageDescription())
            .packageSize(d.getPackageSize() != null ? d.getPackageSize().name() : null)
            .priority(d.getPriority())
            .status(d.getStatus())
            .scheduledDate(d.getScheduledDate())
            .createdAt(d.getCreatedAt())
            .updatedAt(d.getUpdatedAt())
            .build();
    }

    private List<DriverDTO> mapToDTOs(List<Driver> drivers) {
        return drivers.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
