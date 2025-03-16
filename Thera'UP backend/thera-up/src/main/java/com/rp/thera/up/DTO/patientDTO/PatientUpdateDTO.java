package com.rp.thera.up.DTO.patientDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientUpdateDTO {

    private String full_name;
    private String gender;
    private String phone;
    private Date dob;
}
