package com.dispatchdesk.service;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.entity.*;
import com.dispatchdesk.enums.DriverStatus;
import com.dispatchdesk.exception.*;
import com.dispatchdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverService {

    @Autowired private DriverRepository driverRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DeliveryRepository deliveryRepository;

    public PageResponseDTO<DriverDTO> getAllDrivers(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Driver> drivers;
        if (status != null && !status.isEmpty()) {
            drivers = driverRepository.findByStatus(DriverStatus.valueOf(status), pageable);
        } else {
            drivers = driverRepository.findAll(pageable);
        }
        return new PageResponseDTO<>(mapToDTOs(drivers.getContent()), drivers.getNumber(), drivers.getSize(), drivers.getTotalElements(), drivers.getTotalPages());
    }

    public DriverDTO getDriver(Long id) {
        Driver driver = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
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
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        driver.setPhone(request.getPhone());
        driver.setVehicle(request.getVehicle());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setStatus(request.getStatus() != null ? DriverStatus.valueOf(request.getStatus()) : DriverStatus.AVAILABLE);
        return mapToDTO(driverRepository.save(driver));
    }

    public List<DeliveryDTO> getDriverDeliveries(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
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
        }
        dto.setActiveDeliveries(0);
        return dto;
    }

    private DeliveryDTO mapDeliveryDTO(Delivery d) {
        return DeliveryDTO.builder()
            .id(d.getId())
            .deliveryNumber(d.getDeliveryNumber())
            .recipientName(d.getRecipientName())
            .status(d.getStatus())
            .build();
    }

    private List<DriverDTO> mapToDTOs(List<Driver> drivers) {
        return drivers.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
