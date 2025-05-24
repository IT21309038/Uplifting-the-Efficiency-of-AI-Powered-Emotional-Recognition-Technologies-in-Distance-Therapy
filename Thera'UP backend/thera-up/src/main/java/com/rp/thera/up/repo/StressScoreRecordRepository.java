package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Patient;
import com.rp.thera.up.entity.StressScoreRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StressScoreRecordRepository extends JpaRepository<StressScoreRecord, Long> {
    @Query("SELECT s FROM StressScoreRecord s WHERE s.patientId = :patientId ORDER BY s.createdAt DESC LIMIT 1")
    Optional<StressScoreRecord> findLatestStressScoreRecordByPatientId(@Param("patientId") String patientId);

    StressScoreRecord findTopByPatientIdOrderByCreatedAtDesc(String patientId);
}







