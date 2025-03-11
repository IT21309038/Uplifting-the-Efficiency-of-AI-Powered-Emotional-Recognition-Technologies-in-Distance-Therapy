package com.rp.thera.up.controller;

import com.rp.thera.up.service.TherapistLeaveService;
import com.rp.thera.up.serviceImpl.LeaveImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("api/v1/theraup/leave")
@CrossOrigin(origins = "*")
public class LeaveController {

    @Autowired
    LeaveImpl therapistLeaveService;

    @PostMapping(value = "/addLeave")
    public void addLeave(int doctorId, Date leaveDate) {
        therapistLeaveService.addLeave(doctorId, leaveDate);
    }

    @PostMapping(value = "/addOffDay")
    public void addOffDay(int doctorId, String offDay) {
        therapistLeaveService.addOffDay(doctorId, DayOfWeek.valueOf(offDay));
    }
}
