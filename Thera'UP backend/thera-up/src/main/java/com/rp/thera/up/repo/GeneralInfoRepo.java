package com.rp.thera.up.repo;

import com.rp.thera.up.DTO.patientDTO.GeneralInfoDTO;
import com.rp.thera.up.entity.Patient;
import com.rp.thera.up.entity.PatientGeneralInfo;
import org.hibernate.annotations.JavaTypeRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneralInfoRepo extends JpaRepository<PatientGeneralInfo,Long> {
    PatientGeneralInfo findByPatientId(Integer patientId);

    PatientGeneralInfo findTopByPatientOrderByCreatedAtDesc(Patient patient);
}
