package com.rp.thera.up.DTO.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateReportDTO {

    private int patient_id;
    private int doctor_id;
    private LocalDate session_date;
    private LocalTime session_time;
}
