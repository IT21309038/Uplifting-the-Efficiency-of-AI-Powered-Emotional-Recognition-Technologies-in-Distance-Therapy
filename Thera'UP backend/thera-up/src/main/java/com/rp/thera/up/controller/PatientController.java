package com.rp.thera.up.controller;

import com.rp.thera.up.DTO.patientDTO.*;
import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/theraup")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping(value = "/patients/register")
    public ResponseEntity<?> createPatient(@RequestBody PatientPostDTO patientPostDTO) {
        patientService.createPatient(patientPostDTO);
        return ResponseHandler.responseBuilder("Patient registered successfully", HttpStatus.CREATED, null);
    }

    @PostMapping(value = "/patients/login")
    public ResponseEntity<?> patientLogin(@RequestBody LoginPatientDTO loginPatientDTO) {
        PatientGetDTO patient = patientService.loginPatient(loginPatientDTO);
        return ResponseHandler.responseBuilder("Patient logged in successfully", HttpStatus.OK, patient);
    }

    @GetMapping(value = "/patients/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Integer id) {
        PatientGetDTO patient = patientService.getPatient(id);
        return ResponseHandler.responseBuilder("Patient retrieved successfully", HttpStatus.OK, patient);
    }

    @GetMapping(value = "/patients")
    public ResponseEntity<?> getPatients() {
        List<PatientGetDTO> patients = patientService.getPatients();
        return ResponseHandler.responseBuilder("Patients retrieved successfully", HttpStatus.OK, patients);
    }

    @PutMapping(value = "/patients/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Integer id, @RequestBody PatientUpdateDTO patientUpdateDTO) {
        patientService.updatePatient(id, patientUpdateDTO);
        return ResponseHandler.responseBuilder("Patient updated successfully", HttpStatus.OK, null);
    }

    @PutMapping(value = "/patients/password/{id}")
    public ResponseEntity<?> updatePatientPassword(@PathVariable Integer id, @RequestBody PatientPasswordUpdateDTO patientPasswordUpdateDTO) {
        patientService.updatePatientPassword(id, patientPasswordUpdateDTO);
        return ResponseHandler.responseBuilder("Patient password updated successfully", HttpStatus.OK, null);
    }
}
