package com.rp.thera.up.DTO.doctorDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginDoctorDTO {

    private String email;
    private String password;
}
