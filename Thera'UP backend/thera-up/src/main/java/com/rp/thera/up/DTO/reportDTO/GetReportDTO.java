package com.rp.thera.up.DTO.reportDTO;

import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetReportDTO {

    private int id;

    private String report_url;

    private Patient patient;
    private Doctor doctor;

    private String session_date;
    private String session_time;
}
