package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientProgressSummaryDTO {
    private String patientId;
    private int totalAssignedActivities;
    private int completedActivities;
    private int totalTimeRemaining;
    private double progressPercentage;
    private String alertLevel; // Most critical alert level for the patient
}