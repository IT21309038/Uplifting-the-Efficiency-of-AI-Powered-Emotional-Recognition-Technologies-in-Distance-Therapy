package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateRemainingTimeDTO {
    private String patient_id;
    private String activity_id;
    private int remaining_time; // Now an integer (minutes)
}