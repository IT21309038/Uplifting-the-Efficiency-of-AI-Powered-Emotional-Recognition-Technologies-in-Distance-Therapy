package com.rp.thera.up.controller;

import com.rp.thera.up.DTO.postTherapyDTO.*;
import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.service.PostTherapyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/theraup/postTherapy")
@CrossOrigin(origins = "*")
public class PostTherapyController {

    @Autowired
    private PostTherapyService postTherapyService;

    @PostMapping(value = "/suggestActivities")
    public ResponseEntity<?> suggestActivities(@RequestBody PatientPreferencesDTO preferences) {
        List<SuggestedActivityDTO> suggestedActivities = postTherapyService.suggestActivities(preferences);
        return ResponseHandler.responseBuilder("Suggested activities retrieved", HttpStatus.OK, suggestedActivities);
    }

    @PostMapping(value = "/assignActivities")
    public ResponseEntity<?> createPostTherapy(@RequestBody PostTherapyCreateDTO postTherapyCreateDTO) {
        postTherapyService.createPostTherapy(postTherapyCreateDTO);
        return ResponseHandler.responseBuilder("Activities Assigned successfully", HttpStatus.CREATED, null);
    }

    @GetMapping(value = "/progress/{patientId}")
    public ResponseEntity<?> getPatientProgress(@PathVariable String patientId) {
        PatientProgressDTO progress = postTherapyService.getPatientProgress(patientId);
        return ResponseHandler.responseBuilder("Patient progress retrieved", HttpStatus.OK, progress);
    }

    @PostMapping(value = "/logCompletion")
    public ResponseEntity<?> logActivityCompletion(@RequestBody ActivityCompletionDTO completionDTO) {
        postTherapyService.logActivityCompletion(completionDTO);
        return ResponseHandler.responseBuilder("Activity completion logged", HttpStatus.OK, null);
    }

    @PutMapping(value = "/updateRemainingTime")
    public ResponseEntity<?> updateRemainingTime(@RequestBody UpdateRemainingTimeDTO updateRemainingTimeDTO) {
        postTherapyService.updateRemainingTime(updateRemainingTimeDTO);
        return ResponseHandler.responseBuilder("Remaining time updated successfully", HttpStatus.OK, null);
    }
}