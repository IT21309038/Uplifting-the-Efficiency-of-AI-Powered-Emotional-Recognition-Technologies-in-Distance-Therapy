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
    private int totalTimeRemaining; // In minutes
    private double progressPercentage; // Overall progress percentage
}