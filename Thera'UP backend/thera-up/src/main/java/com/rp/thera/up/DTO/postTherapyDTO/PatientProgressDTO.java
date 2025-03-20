package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientProgressDTO {
    private String patient_id;
    private int totalActivities;
    private int completedActivities;
    private String progressStatus;
    private int totalTimeAssigned;
    private int totalTimeRemaining;
    private String alertLevel; // New field: Patient-level alert level
    private List<ActivityProgressDTO> activityProgressList;
}