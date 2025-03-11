package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.entity.TherapistLeave;
import com.rp.thera.up.repo.DoctorRepo;
import com.rp.thera.up.repo.TherapistLeaveRepository;
import com.rp.thera.up.service.TherapistLeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Date;

@Service
public class LeaveImpl implements TherapistLeaveService {

    @Autowired
    private TherapistLeaveRepository therapistLeaveRepository;

    @Autowired
    private DoctorRepo doctorRepository;

    public void addLeave(int doctorId, Date leaveDate) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);

        if (doctor == null) {
            throw new RuntimeException("Doctor not found");
        } else {
            if (leaveDate.before(new Date(System.currentTimeMillis() + 10L * 24 * 60 * 60 * 1000))) {
                throw new RuntimeException("Leave date should be at least 10 days from today");
            } else {
                TherapistLeave leave = new TherapistLeave();
                leave.setDoctor(doctor);
                leave.setLeaveDate(leaveDate);
                therapistLeaveRepository.save(leave);
            }
        }
    }

    @Override
    public void addOffDay(int doctorId, DayOfWeek offDay) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);

        if (doctor == null) {
            throw new RuntimeException("Doctor not found");
        } else {
            TherapistLeave leave = new TherapistLeave();
            leave.setDoctor(doctor);
            leave.setOffDay(offDay);
            therapistLeaveRepository.save(leave);
        }
    }
}