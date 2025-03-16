package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostTherapyCreateDTO {
    private String patient_id;
    private String activity_id;
    private String allocated_duration;
    private String remaining_time;
}
