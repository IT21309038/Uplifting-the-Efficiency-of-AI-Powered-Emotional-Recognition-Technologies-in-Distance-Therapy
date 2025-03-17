package com.rp.thera.up.entity;


import com.rp.thera.up.DTO.Schedule.ScheduleOption;
import com.rp.thera.up.repo.DoctorRepo;
import com.rp.thera.up.repo.PatientRepo;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Schedule {
    @Id
    private String session_id;
    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", nullable = false)
    private Patient  patient;
    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "id", nullable = false)
    private Doctor  doctor;
    private LocalDate date;
    private LocalTime time;
    private int sessionDuration;
    private String status;
    private String paymentStatus;
    private double rating;

}
