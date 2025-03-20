package com.rp.thera.up.service;

import com.rp.thera.up.DTO.doctorDTO.CreateDoctorDTO;
import com.rp.thera.up.DTO.doctorDTO.LoginDoctorDTO;
import com.rp.thera.up.DTO.doctorDTO.SucessLoginDoctorDTO;
import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.entity.Patient;

import java.util.List;

public interface DoctorService {

    public Doctor createDoctor(CreateDoctorDTO createDoctorDTO);

    public SucessLoginDoctorDTO doctorLogin(LoginDoctorDTO loginDoctorDTO);

    public List<Patient> getPatientList(Long id, String status);
}
