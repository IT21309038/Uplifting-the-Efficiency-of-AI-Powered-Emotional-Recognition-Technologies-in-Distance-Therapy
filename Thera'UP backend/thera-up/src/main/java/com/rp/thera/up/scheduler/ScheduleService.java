package com.rp.thera.up.scheduler;

import com.rp.thera.up.entity.Schedule;
import com.rp.thera.up.repo.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepo scheduleRepository;

    @Scheduled(cron = "0 10 0 * * *")
    public void updatePendingSchedules() {
        LocalDate previousDay = LocalDate.now().minusDays(1);
        List<Schedule> schedules = scheduleRepository.findByDateAndStatus(previousDay, "pending");
        for (Schedule schedule : schedules) {
            schedule.setStatus("not completed");
        }
        scheduleRepository.saveAll(schedules);
    }
}
