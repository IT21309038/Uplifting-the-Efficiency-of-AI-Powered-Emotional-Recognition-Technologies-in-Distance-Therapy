package com.rp.thera.up.DTO.patientDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeneralInfoDTO {
    private String patientId;
    private String empStatus;
    private String civilStatus;
    private String livingStatus;
    private String income;
    private String socialLife;

}
