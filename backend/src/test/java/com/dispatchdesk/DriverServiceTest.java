package com.dispatchdesk;

import com.dispatchdesk.dto.CreateDriverRequest;
import com.dispatchdesk.dto.DriverDTO;
import com.dispatchdesk.dto.PageResponseDTO;
import com.dispatchdesk.enums.DriverStatus;
import com.dispatchdesk.repository.DeliveryRepository;
import com.dispatchdesk.repository.DeliveryStatusHistoryRepository;
import com.dispatchdesk.repository.DriverRepository;
import com.dispatchdesk.service.DriverService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class DriverServiceTest {

    @Autowired
    private DriverService driverService;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DeliveryStatusHistoryRepository historyRepository;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        deliveryRepository.deleteAll();
        driverRepository.deleteAll();
    }

    @Test
    void testCreateAndGetDriver() {
        CreateDriverRequest request = CreateDriverRequest.builder()
            .phone("+251911334455")
            .vehicle("Mitsubishi L300")
            .licenseNumber("DL-2024")
            .status("AVAILABLE")
            .build();

        DriverDTO created = driverService.createDriver(request);
        assertNotNull(created.getId());
        assertEquals("Mitsubishi L300", created.getVehicle());
        assertEquals(DriverStatus.AVAILABLE, created.getStatus());

        DriverDTO fetched = driverService.getDriver(created.getId());
        assertEquals("+251911334455", fetched.getPhone());
    }

    @Test
    void testGetAllDriversFiltering() {
        driverService.createDriver(new CreateDriverRequest("+251911", "Van 1", "DL-1", "AVAILABLE"));
        driverService.createDriver(new CreateDriverRequest("+251912", "Truck 1", "DL-2", "OFFLINE"));

        PageResponseDTO<DriverDTO> allDrivers = driverService.getAllDrivers(null, 0, 10);
        assertEquals(2, allDrivers.getTotalElements());

        PageResponseDTO<DriverDTO> availableOnly = driverService.getAllDrivers("AVAILABLE", 0, 10);
        assertEquals(1, availableOnly.getTotalElements());
        assertEquals(DriverStatus.AVAILABLE, availableOnly.getContent().get(0).getStatus());
    }
}
