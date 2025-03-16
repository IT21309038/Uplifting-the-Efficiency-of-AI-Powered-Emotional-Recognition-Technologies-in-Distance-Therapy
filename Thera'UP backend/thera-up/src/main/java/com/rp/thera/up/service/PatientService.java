package com.rp.thera.up.service;

import com.rp.thera.up.DTO.patientDTO.*;

import java.util.List;

public interface PatientService {

    void createPatient(PatientPostDTO patientPostDTO);

    PatientGetDTO loginPatient(LoginPatientDTO loginPatientDTO);

    PatientGetDTO getPatient(Integer id);

    List<PatientGetDTO> getPatients();

    void updatePatient(Integer id, PatientUpdateDTO patientUpdateDTO);

    void updatePatientPassword(Integer id, PatientPasswordUpdateDTO patientPasswordUpdateDTO);
}
