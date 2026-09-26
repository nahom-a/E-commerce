package com.dispatchdesk.controller;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired private DriverService driverService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDTO<DriverDTO>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getAllDrivers(status, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DriverDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDriver(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<DriverDTO>> create(@RequestBody CreateDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.success(driverService.createDriver(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<ApiResponse<DriverDTO>> update(@PathVariable Long id, @RequestBody CreateDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.success(driverService.updateDriver(id, request)));
    }

    @GetMapping("/{id}/deliveries")
    public ResponseEntity<ApiResponse<List<DeliveryDTO>>> getDeliveries(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDriverDeliveries(id)));
    }
}
