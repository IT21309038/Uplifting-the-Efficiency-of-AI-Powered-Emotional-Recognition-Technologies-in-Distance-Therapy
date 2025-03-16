package com.rp.thera.up.DTO.patientDTO;

import com.rp.thera.up.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientGetDTO {

    private int id;
    private String full_name;
    private String email;
    private String gender;
    private String phone;
    private Date dob;

    private Role role;

    private Date joined_at;
}
