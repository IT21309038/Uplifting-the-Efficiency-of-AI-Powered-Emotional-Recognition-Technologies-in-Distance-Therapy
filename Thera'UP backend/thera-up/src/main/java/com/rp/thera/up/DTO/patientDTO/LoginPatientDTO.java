package com.rp.thera.up.DTO.patientDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginPatientDTO {

    private String email;
    private String password;
}
