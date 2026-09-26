package com.dispatchdesk.controller;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.service.DeliveryServiceComplete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired private DeliveryServiceComplete deliveryService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDTO<DeliveryDTO>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long driverId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponseDTO<DeliveryDTO> result = deliveryService.getAllDeliveries(search, status, driverId, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeliveryDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.getDelivery(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<DeliveryDTO>> create(@RequestBody CreateDeliveryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.createDelivery(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<DeliveryDTO>> update(@PathVariable Long id, @RequestBody CreateDeliveryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.updateDelivery(id, request)));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<DeliveryDTO>> assignDriver(@PathVariable Long id, @RequestBody AssignDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.assignDriver(id, request)));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<DeliveryDTO>> changeStatus(@PathVariable Long id, @RequestBody StatusChangeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.changeStatus(id, request)));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable Long id) {
        deliveryService.cancelDelivery(id);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<com.dispatchdesk.entity.DeliveryStatusHistory>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.getDeliveryHistory(id)));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<DeliveryDTO>>> getByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(ApiResponse.success(deliveryService.getDriverDeliveries(driverId)));
    }
}
