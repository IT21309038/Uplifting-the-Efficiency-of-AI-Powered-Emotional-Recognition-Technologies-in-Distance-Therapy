package com.rp.thera.up.service;

import com.rp.thera.up.DTO.postTherapyDTO.*;

import java.util.List;

public interface PostTherapyService {
    void createPostTherapy(PostTherapyCreateDTO postTherapyCreateDTO);
    PatientProgressDTO getPatientProgress(String patientId);
    void logActivityCompletion(ActivityCompletionDTO completionDTO);
    List<SuggestedActivityDTO> suggestActivities(PatientPreferencesDTO preferences);
    void updateRemainingTime(UpdateRemainingTimeDTO updateRemainingTimeDTO); // New method
}