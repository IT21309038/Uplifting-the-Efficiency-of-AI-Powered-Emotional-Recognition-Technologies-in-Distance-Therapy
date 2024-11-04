package com.rp.thera.up.controller;

import com.rp.thera.up.DTO.doctorDTO.CreateDoctorDTO;
import com.rp.thera.up.DTO.doctorDTO.LoginDoctorDTO;
import com.rp.thera.up.DTO.doctorDTO.SucessLoginDoctorDTO;
import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/theraup")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping(value = "/doctors/register")
    public ResponseEntity<?> createDoctor(@RequestBody CreateDoctorDTO createDoctorDTO) {
        doctorService.createDoctor(createDoctorDTO);
        return ResponseHandler.responseBuilder("Doctor registered successfully", HttpStatus.CREATED, null);
    }

    @PostMapping(value = "/doctors/login")
    public ResponseEntity<?> doctorLogin(@RequestBody LoginDoctorDTO loginDoctorDTO) {
        SucessLoginDoctorDTO doctor = doctorService.doctorLogin(loginDoctorDTO);
        return ResponseHandler.responseBuilder("Doctor logged in successfully", HttpStatus.OK, doctor);
    }
}
