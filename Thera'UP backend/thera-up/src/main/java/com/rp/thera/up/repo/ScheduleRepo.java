package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

public interface ScheduleRepo extends JpaRepository<Schedule, Long> {

    List<Schedule> findByDoctorIdAndDate(int doctorId, Date date);

}
