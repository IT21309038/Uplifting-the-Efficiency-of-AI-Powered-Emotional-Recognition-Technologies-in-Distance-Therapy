package com.rp.thera.up.repo;

import com.rp.thera.up.entity.PostTherapy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostTherapyRepo extends JpaRepository<PostTherapy, Integer> {
    @Query("SELECT p FROM PostTherapy p WHERE p.patient_id = :patientId")
    List<PostTherapy> findByPatientId(@Param("patientId") String patientId);
}