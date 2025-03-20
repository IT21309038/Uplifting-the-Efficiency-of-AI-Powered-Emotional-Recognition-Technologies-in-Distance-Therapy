package com.rp.thera.up.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class PatientPhysicalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private Patient patient;

    private String sleepOption;
    private String eatOption;
    private String overwhelmedOption;
    private String angryOption;
    private String focusOption;
    private String memoryOption;
    private String socialOption;
    private String physicalOption;
    private String negativeOption;
    private Double stressScore;
    private Date createdAt;
}