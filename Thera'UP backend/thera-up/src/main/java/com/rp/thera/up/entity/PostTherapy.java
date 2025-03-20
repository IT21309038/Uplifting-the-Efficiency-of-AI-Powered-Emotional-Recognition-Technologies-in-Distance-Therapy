package com.rp.thera.up.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class PostTherapy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patient_id;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    private int allocated_duration;
    private int remaining_time;
    private boolean completed;
    private double completion_percentage;
    private LocalDateTime assignedDate; // New field: Date and time of assignment
    private String alertLevel;          // New field: Alert level (Immediate, Normal, Good)
}