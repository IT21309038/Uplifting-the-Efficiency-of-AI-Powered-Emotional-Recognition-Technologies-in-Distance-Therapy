package com.rp.thera.up.DTO.postTherapyDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientPreferencesDTO {
    private Integer stressLevel; // Nullable, unset if null
    private Boolean prefersIndoor; // Nullable, unset if null
    private Boolean prefersPhysical; // Nullable, unset if null
    private Integer availableTimeMinutes; // Nullable, unset if null
    private Integer age; // Nullable, unset if null
    private String gender; // Optional, not used in filtering yet
    private Boolean prefersCreative; // Nullable, unset if null
    private String energyLevel; // Nullable, unset if null
}