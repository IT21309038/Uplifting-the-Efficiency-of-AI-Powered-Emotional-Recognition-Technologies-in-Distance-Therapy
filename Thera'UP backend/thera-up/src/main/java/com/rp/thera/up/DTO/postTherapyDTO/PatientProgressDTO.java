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
    private int totalTimeAssigned;       // New field: Sum of allocated_duration
    private int totalTimeRemaining;      // New field: Sum of remaining_time
    private List<ActivityProgressDTO> activityProgressList;
}