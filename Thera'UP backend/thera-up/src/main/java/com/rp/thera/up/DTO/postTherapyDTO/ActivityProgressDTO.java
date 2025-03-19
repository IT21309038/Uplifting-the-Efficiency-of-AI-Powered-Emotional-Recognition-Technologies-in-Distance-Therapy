package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ActivityProgressDTO {
    private String activity_id;
    private String activity_name;
    private double completion_percentage; // Already matches the new field
}