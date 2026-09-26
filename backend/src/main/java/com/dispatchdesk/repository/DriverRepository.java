package com.dispatchdesk.repository;

import com.dispatchdesk.entity.Driver;
import com.dispatchdesk.enums.DriverStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUserId(Long userId);

    Page<Driver> findByStatus(DriverStatus status, Pageable pageable);
}
