package com.rp.thera.up.DTO.doctorDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateDoctorDTO {

    private String first_name;
    private String last_name;
    private String license_number;
    private String qualification;
    private double rate_per_hour;
    private String experience;
    private String gender;
    private String email;
    private String password;
    private int role_id;
    private int career_role_id;
}
