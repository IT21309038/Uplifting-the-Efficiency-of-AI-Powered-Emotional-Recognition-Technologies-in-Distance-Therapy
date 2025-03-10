package com.rp.thera.up.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Schedule {
    @Id
    private String session_id;
    private int  patientId;
    private int  doctorId;
    private LocalDate date;
    private LocalTime time;
    private int sessionDuration;
    private String status;
}
