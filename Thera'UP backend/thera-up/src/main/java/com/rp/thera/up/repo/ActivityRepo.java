package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ActivityRepo extends JpaRepository<Activity, String>, JpaSpecificationExecutor<Activity> {
}