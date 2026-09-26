package com.dispatchdesk;

import com.dispatchdesk.enums.DeliveryStatus;
import com.dispatchdesk.service.DeliveryServiceComplete;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class DeliveryStatusTransitionTest {

    @Autowired
    private DeliveryServiceComplete deliveryService;

    @Test
    void testValidStatusTransitions() {
        // PENDING -> ASSIGNED or CANCELLED
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED));
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.PENDING, DeliveryStatus.CANCELLED));

        // ASSIGNED -> PICKED_UP or CANCELLED
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.ASSIGNED, DeliveryStatus.PICKED_UP));
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.ASSIGNED, DeliveryStatus.CANCELLED));

        // PICKED_UP -> OUT_FOR_DELIVERY
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.PICKED_UP, DeliveryStatus.OUT_FOR_DELIVERY));

        // OUT_FOR_DELIVERY -> DELIVERED or FAILED
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.OUT_FOR_DELIVERY, DeliveryStatus.DELIVERED));
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.OUT_FOR_DELIVERY, DeliveryStatus.FAILED));

        // FAILED -> OUT_FOR_DELIVERY (retry delivery)
        assertTrue(deliveryService.isValidTransition(DeliveryStatus.FAILED, DeliveryStatus.OUT_FOR_DELIVERY));
    }

    @Test
    void testInvalidStatusTransitions() {
        // Terminal states cannot transition
        assertFalse(deliveryService.isValidTransition(DeliveryStatus.DELIVERED, DeliveryStatus.OUT_FOR_DELIVERY));
        assertFalse(deliveryService.isValidTransition(DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED));
        assertFalse(deliveryService.isValidTransition(DeliveryStatus.CANCELLED, DeliveryStatus.PENDING));

        // Skipping intermediate states is invalid
        assertFalse(deliveryService.isValidTransition(DeliveryStatus.PENDING, DeliveryStatus.DELIVERED));
        assertFalse(deliveryService.isValidTransition(DeliveryStatus.PENDING, DeliveryStatus.OUT_FOR_DELIVERY));
        assertFalse(deliveryService.isValidTransition(DeliveryStatus.ASSIGNED, DeliveryStatus.DELIVERED));
    }
}
