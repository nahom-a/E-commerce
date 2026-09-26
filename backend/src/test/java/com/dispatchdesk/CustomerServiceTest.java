package com.dispatchdesk;

import com.dispatchdesk.dto.CreateCustomerRequest;
import com.dispatchdesk.dto.CustomerDTO;
import com.dispatchdesk.dto.PageResponseDTO;
import com.dispatchdesk.repository.CustomerRepository;
import com.dispatchdesk.repository.DeliveryRepository;
import com.dispatchdesk.repository.DeliveryStatusHistoryRepository;
import com.dispatchdesk.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DeliveryStatusHistoryRepository historyRepository;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        deliveryRepository.deleteAll();
        customerRepository.deleteAll();
    }

    @Test
    void testCreateAndGetCustomer() {
        CreateCustomerRequest request = CreateCustomerRequest.builder()
            .name("Kazanchis Bakery")
            .contactPerson("Haile K.")
            .phone("+251912123456")
            .email("haile@bakery.et")
            .address("Kazanchis, Addis Ababa")
            .notes("Daily morning orders")
            .build();

        CustomerDTO created = customerService.createCustomer(request);
        assertNotNull(created.getId());
        assertEquals("Kazanchis Bakery", created.getName());

        CustomerDTO fetched = customerService.getCustomer(created.getId());
        assertEquals("haile@bakery.et", fetched.getEmail());
    }

    @Test
    void testGetAllCustomersPagination() {
        customerService.createCustomer(new CreateCustomerRequest("Customer A", "Person A", "+2519111", "a@test.et", "Bole", ""));
        customerService.createCustomer(new CreateCustomerRequest("Customer B", "Person B", "+2519112", "b@test.et", "CMC", ""));

        PageResponseDTO<CustomerDTO> page = customerService.getAllCustomers(0, 10);
        assertEquals(2, page.getTotalElements());
        assertEquals(2, page.getContent().size());
    }
}
