package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleRepo extends JpaRepository<Schedule, String> {

    List<Schedule> findByDoctorIdAndDate(int doctorId, LocalDate date);

    List<Schedule> findByDoctorIdAndStatusAndDateBetween(Long doctorId, String status, LocalDate startDate, LocalDate endDate);

    List<Schedule> findByDateAndStatus(LocalDate date, String status);

    List<Schedule> findByPatientIdAndStatusIn(Long patientId, List<String> statuses);

    List<Schedule> findByPatientIdAndStatus(Long patientId, String status);

}
