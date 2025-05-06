package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Reports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReportRepo extends JpaRepository<Reports, Integer> {

    //find by id
    @Query(value = "SELECT * FROM reports WHERE reports.id = ?1",nativeQuery = true)
    Optional<Reports> getReportsById(int id);
}
