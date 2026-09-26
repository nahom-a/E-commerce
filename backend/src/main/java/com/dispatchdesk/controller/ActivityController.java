package com.dispatchdesk.controller;

import com.dispatchdesk.dto.*;
import com.dispatchdesk.entity.ActivityLog;
import com.dispatchdesk.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired private ActivityService activityService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityLog>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(activityService.getActivity()));
    }
}
