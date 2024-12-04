package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {

    @Query(value = "SELECT * FROM doctor WHERE doctor.email = ?1",nativeQuery = true)
    Doctor findByEmail(String email);

    //find by license number
    @Query(value = "SELECT * FROM doctor WHERE doctor.license_number = ?1",nativeQuery = true)
    Doctor findByLicenseNumber(String license_number);
}
