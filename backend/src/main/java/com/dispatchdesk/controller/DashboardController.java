package com.dispatchdesk.controller;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<List<com.dispatchdesk.entity.ActivityLog>>> getActivity() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentActivity()));
    }
}
