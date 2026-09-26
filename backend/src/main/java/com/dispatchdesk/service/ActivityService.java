package com.dispatchdesk.service;

import com.dispatchdesk.entity.ActivityLog;
import com.dispatchdesk.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    @Autowired private ActivityLogRepository activityLogRepository;

    public List<ActivityLog> getActivity() {
        return activityLogRepository.findAllByOrderByCreatedAtDesc();
    }
}
