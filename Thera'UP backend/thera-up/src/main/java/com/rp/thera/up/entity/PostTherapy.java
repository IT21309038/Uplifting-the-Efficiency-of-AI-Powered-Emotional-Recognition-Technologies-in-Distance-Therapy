package com.rp.thera.up.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private int allocated_duration; // Now an integer (minutes)
    private int remaining_time;     // Now an integer (minutes)
    private boolean completed;
    private double completion_percentage;
}