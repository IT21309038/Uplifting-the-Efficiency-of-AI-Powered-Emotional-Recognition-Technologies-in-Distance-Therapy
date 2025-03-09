package com.rp.thera.up.service;


import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public interface TherapistLeaveService {
    public void addLeave(int doctorId, LocalDate leaveDate);

    public void addOffDay(int doctorId, DayOfWeek offDay);


}


