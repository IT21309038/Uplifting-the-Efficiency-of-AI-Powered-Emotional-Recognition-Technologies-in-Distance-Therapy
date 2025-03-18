package com.rp.thera.up.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Activity {
    @Id
    private String activity_id;
    private String name;
    private boolean isIndoor; // True for indoor, false for outdoor
    private boolean isPhysical; // True if involves physical effort
    private int minStressLevel; // Minimum stress level (0-10)
    private int maxStressLevel; // Maximum stress level (0-10)
    private int defaultDurationMinutes; // Default duration in minutes
    private int minAge; // Minimum recommended age
    private int maxAge; // Maximum recommended age
    private boolean isCreative; // True if creative (e.g., drawing, journaling)
    private String energyLevel; // "LOW", "MEDIUM", "HIGH" - required energy
}