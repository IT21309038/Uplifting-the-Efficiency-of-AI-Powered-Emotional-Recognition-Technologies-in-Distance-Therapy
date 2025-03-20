package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Patient;
import com.rp.thera.up.entity.PatientPhysicalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PhysicalInfoRepo extends JpaRepository<PatientPhysicalInfo, Long> {
    @Query("SELECT p FROM PatientPhysicalInfo p WHERE p.patient.id = :patientId ORDER BY p.createdAt DESC LIMIT 1")
    Optional<PatientPhysicalInfo> findLatestPhysicalInfoByPatientId(@Param("patientId") Long patientId);

    PatientPhysicalInfo findTopByPatientOrderByCreatedAtDesc(Patient patient);
}
