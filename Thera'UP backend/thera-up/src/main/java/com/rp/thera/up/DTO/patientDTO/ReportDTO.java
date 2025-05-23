package com.rp.thera.up.DTO.patientDTO;

import com.rp.thera.up.entity.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReportDTO {
    private Patient patient;
    private PatientGeneralInfo latestGeneralInfo;
    private PatientPhysicalInfo latestPhysicalInfo;
    private Schedule latestSchedule;
    private StressScoreRecord latestStressScoreRecord;
}
