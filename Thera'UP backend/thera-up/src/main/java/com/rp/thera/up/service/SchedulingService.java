package com.rp.thera.up.service;

import com.rp.thera.up.DTO.Schedule.ScheduleOption;
import com.rp.thera.up.entity.Schedule;
import com.rp.thera.up.entity.StressScoreRecord;

import java.util.List;

public interface SchedulingService {
    public List<Schedule> scheduleSession(StressScoreRecord recode);

    public List<Schedule> saveStressScoreRecord(StressScoreRecord record);

    public Schedule selectSchedule(ScheduleOption schedule);

    public List<Schedule> getScheduleByDoctor(Long doctorId, String sortBy);

    public List<Schedule> getScheduleByPatient(Long patientId, String type, Integer count);

    public Schedule rateSession(String sessionId, double rating);
}
