package com.rp.thera.up.DTO.patientDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientPostDTO {

    private String full_name;
    private String email;
    private String password;
    private String gender;
    private String phone;
    private Date dob;
}
