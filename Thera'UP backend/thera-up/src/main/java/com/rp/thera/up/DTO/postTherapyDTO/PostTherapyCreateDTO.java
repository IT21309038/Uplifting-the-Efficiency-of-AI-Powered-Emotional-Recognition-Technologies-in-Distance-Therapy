package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostTherapyCreateDTO {
    private String patient_id;
    private List<ActivityAssignmentDTO> activities; // Activities with therapist-allocated durations
}