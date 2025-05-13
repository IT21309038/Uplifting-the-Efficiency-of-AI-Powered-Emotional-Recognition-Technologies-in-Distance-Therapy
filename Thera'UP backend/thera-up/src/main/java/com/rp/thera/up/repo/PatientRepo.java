package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient, Integer> {

    //find by email
    @Query(value = "SELECT * FROM patient WHERE patient.email = ?1",nativeQuery = true)
    Optional<Patient> findByEmail(String email);

    //find by id
    @Query(value = "SELECT * FROM patient WHERE patient.id = ?1",nativeQuery = true)
    Optional<Patient> findById(int id);
}
