package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SuggestedActivityDTO {
    private String activityId;
    private String name;
    private int defaultDurationMinutes; // Suggested duration
}