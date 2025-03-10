package com.rp.thera.up.service;

import com.rp.thera.up.entity.Schedule;
import com.rp.thera.up.entity.StressScoreRecord;

import java.util.List;

public interface SchedulingService {
    public List<Schedule> scheduleSession(StressScoreRecord recode);

    public List<Schedule> saveStressScoreRecord(StressScoreRecord record);

    public Schedule selectSchedule(Schedule schedule);
}
