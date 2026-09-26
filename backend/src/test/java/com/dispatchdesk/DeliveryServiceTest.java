package com.dispatchdesk;

import com.dispatchdesk.dto.AssignDriverRequest;
import com.dispatchdesk.dto.CreateDeliveryRequest;
import com.dispatchdesk.dto.DeliveryDTO;
import com.dispatchdesk.dto.StatusChangeRequest;
import com.dispatchdesk.entity.Customer;
import com.dispatchdesk.entity.Driver;
import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.enums.DriverStatus;
import com.dispatchdesk.enums.Priority;
import com.dispatchdesk.exception.AccessDeniedException;
import com.dispatchdesk.exception.InvalidStatusTransitionException;
import com.dispatchdesk.repository.CustomerRepository;
import com.dispatchdesk.repository.DeliveryRepository;
import com.dispatchdesk.repository.DeliveryStatusHistoryRepository;
import com.dispatchdesk.repository.DriverRepository;
import com.dispatchdesk.service.DeliveryServiceComplete;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class DeliveryServiceTest {

    @Autowired
    private DeliveryServiceComplete deliveryService;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DeliveryStatusHistoryRepository historyRepository;

    private Customer customer;
    private Driver driver;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        deliveryRepository.deleteAll();
        driverRepository.deleteAll();
        customerRepository.deleteAll();

        customer = customerRepository.save(new Customer(null, "Mekdes Cafe", "Mekdes T.", "+251911123456", "mekdes@cafe.et", "Bole, Addis Ababa", "VIP", null));
        driver = driverRepository.save(new Driver(null, null, "+251911223344", "Toyota HiAce", "DL-100", DriverStatus.AVAILABLE, null));
    }

    @Test
    void testCreateDeliveryGeneratesDeliveryNumberAndPendingStatus() {
        CreateDeliveryRequest request = CreateDeliveryRequest.builder()
            .customerId(customer.getId())
            .recipientName("Abebe Bikila")
            .recipientPhone("+251911998877")
            .address("Kazanchis, Addis Ababa")
            .city("Addis Ababa")
            .packageDescription("Specialty Coffee Beans")
            .packageSize("MEDIUM")
            .priority(Priority.HIGH)
            .build();

        DeliveryDTO dto = deliveryService.createDelivery(request);

        assertNotNull(dto.getId());
        assertTrue(dto.getDeliveryNumber().startsWith("DLV-"));
        assertEquals(DeliveryStatus.PENDING, dto.getStatus());
        assertEquals("Abebe Bikila", dto.getRecipientName());
        assertEquals("Mekdes Cafe", dto.getCustomerName());
    }

    @Test
    void testAssignDriverUpdatesStatusToAssigned() {
        CreateDeliveryRequest request = CreateDeliveryRequest.builder()
            .customerId(customer.getId())
            .recipientName("Sara T.")
            .recipientPhone("+251911223344")
            .address("Bole Atlas")
            .city("Addis Ababa")
            .packageDescription("Documents")
            .build();

        DeliveryDTO created = deliveryService.createDelivery(request);
        DeliveryDTO assigned = deliveryService.assignDriver(created.getId(), new AssignDriverRequest(driver.getId()));

        assertEquals(DeliveryStatus.ASSIGNED, assigned.getStatus());
        assertEquals(driver.getId(), assigned.getDriverId());
    }

    @Test
    void testAssignOfflineDriverThrowsAccessDeniedException() {
        Driver offlineDriver = driverRepository.save(new Driver(null, null, "+251999999999", "Isuzu", "DL-999", DriverStatus.OFFLINE, null));

        CreateDeliveryRequest request = CreateDeliveryRequest.builder()
            .customerId(customer.getId())
            .recipientName("Test")
            .recipientPhone("123")
            .address("Addis")
            .packageDescription("Box")
            .build();

        DeliveryDTO created = deliveryService.createDelivery(request);

        assertThrows(AccessDeniedException.class, () ->
            deliveryService.assignDriver(created.getId(), new AssignDriverRequest(offlineDriver.getId()))
        );
    }

    @Test
    void testInvalidStatusTransitionThrowsException() {
        CreateDeliveryRequest request = CreateDeliveryRequest.builder()
            .customerId(customer.getId())
            .recipientName("Test")
            .recipientPhone("123")
            .address("Addis")
            .packageDescription("Box")
            .build();

        DeliveryDTO created = deliveryService.createDelivery(request);

        // PENDING -> DELIVERED is invalid
        assertThrows(InvalidStatusTransitionException.class, () ->
            deliveryService.changeStatus(created.getId(), new StatusChangeRequest("DELIVERED", "Skipped steps"))
        );
    }

    @Test
    void testCancelDeliveryWorkflow() {
        CreateDeliveryRequest request = CreateDeliveryRequest.builder()
            .customerId(customer.getId())
            .recipientName("Test")
            .recipientPhone("123")
            .address("Addis")
            .packageDescription("Box")
            .build();

        DeliveryDTO created = deliveryService.createDelivery(request);
        deliveryService.cancelDelivery(created.getId());

        DeliveryDTO cancelled = deliveryService.getDelivery(created.getId());
        assertEquals(DeliveryStatus.CANCELLED, cancelled.getStatus());
    }
}
