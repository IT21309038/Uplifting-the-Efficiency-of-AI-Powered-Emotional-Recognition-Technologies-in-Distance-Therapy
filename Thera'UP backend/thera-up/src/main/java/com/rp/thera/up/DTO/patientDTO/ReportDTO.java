package com.rp.thera.up.DTO.patientDTO;

import com.rp.thera.up.entity.Patient;
import com.rp.thera.up.entity.PatientGeneralInfo;
import com.rp.thera.up.entity.PatientPhysicalInfo;
import com.rp.thera.up.entity.Schedule;
import lombok.Data;

@Data
public class ReportDTO {
    private Patient patient;
    private PatientGeneralInfo latestGeneralInfo;
    private PatientPhysicalInfo latestPhysicalInfo;
    private Schedule latestSchedule;
}
