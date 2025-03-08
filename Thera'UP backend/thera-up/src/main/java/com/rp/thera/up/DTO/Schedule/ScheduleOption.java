package com.rp.thera.up.DTO.Schedule;

import com.rp.thera.up.entity.Doctor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleOption {
    private String sessionCode;
    private int patientId;
    private int doctorId;
    private LocalDate date;
    private LocalTime time;
    private int sessionLength; // in minutes
}







