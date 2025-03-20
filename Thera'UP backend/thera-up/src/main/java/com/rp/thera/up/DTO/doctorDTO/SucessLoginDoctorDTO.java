package com.rp.thera.up.DTO.doctorDTO;

import com.rp.thera.up.entity.CareerRoles;
import com.rp.thera.up.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SucessLoginDoctorDTO {

    private int id;
    private String first_name;
    private String last_name;
    private String full_name;
    private String email;
    private Role role;
    private CareerRoles career_roles;
}
