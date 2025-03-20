package com.rp.thera.up.DTO.patientDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PhysicalInfoDTO {
    private String patientId;
    private String sleepOption;
    private String eatOption;
    private String overwhelmedOption;
    private String angryOption;
    private String focusOption;
    private String memoryOption;
    private String socialOption;
    private String physicalOption;
    private String negativeOption;
    private double stressScore;

}
