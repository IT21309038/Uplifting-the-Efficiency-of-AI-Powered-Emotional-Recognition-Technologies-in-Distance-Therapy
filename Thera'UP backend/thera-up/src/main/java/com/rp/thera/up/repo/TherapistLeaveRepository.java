package com.rp.thera.up.repo;

import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.entity.TherapistLeave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public interface TherapistLeaveRepository extends JpaRepository<TherapistLeave, Long> {
    boolean existsByDoctorIdAndLeaveDate(int doctorId, LocalDate date);

    List<TherapistLeave> findByDoctorIdAndOffDay(int doctorId, DayOfWeek offDay);
}

