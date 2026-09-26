package com.dispatchdesk.service;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.entity.*;
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
public class CustomerService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private DeliveryRepository deliveryRepository;

    public PageResponseDTO<CustomerDTO> getAllCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Customer> customers = customerRepository.findAll(pageable);
        return new PageResponseDTO<>(mapToDTOs(customers.getContent()), customers.getNumber(), customers.getSize(), customers.getTotalElements(), customers.getTotalPages());
    }

    public CustomerDTO getCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return mapToDTO(customer);
    }

    public CustomerDTO createCustomer(CreateCustomerRequest request) {
        Customer customer = Customer.builder()
            .name(request.getName())
            .contactPerson(request.getContactPerson())
            .phone(request.getPhone())
            .email(request.getEmail())
            .address(request.getAddress())
            .notes(request.getNotes())
            .build();
        return mapToDTO(customerRepository.save(customer));
    }

    public CustomerDTO updateCustomer(Long id, CreateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        customer.setName(request.getName());
        customer.setContactPerson(request.getContactPerson());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setNotes(request.getNotes());
        return mapToDTO(customerRepository.save(customer));
    }

    public List<DeliveryDTO> getCustomerDeliveries(Long customerId) {
        return deliveryRepository.findByCustomerId(customerId).stream().map(this::mapDeliveryDTO).collect(Collectors.toList());
    }

    private CustomerDTO mapToDTO(Customer c) {
        return CustomerDTO.builder()
            .id(c.getId())
            .name(c.getName())
            .contactPerson(c.getContactPerson())
            .phone(c.getPhone())
            .email(c.getEmail())
            .address(c.getAddress())
            .notes(c.getNotes())
            .createdAt(c.getCreatedAt())
            .build();
    }

    private DeliveryDTO mapDeliveryDTO(Delivery d) {
        return DeliveryDTO.builder()
            .id(d.getId())
            .deliveryNumber(d.getDeliveryNumber())
            .recipientName(d.getRecipientName())
            .status(d.getStatus())
            .build();
    }

    private List<CustomerDTO> mapToDTOs(List<Customer> customers) {
        return customers.stream().map(this::mapToDTO).collect(Collectors.toList());
    }
}
