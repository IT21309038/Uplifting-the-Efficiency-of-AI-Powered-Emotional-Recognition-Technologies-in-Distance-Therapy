package com.rp.thera.up.controller;


import com.rp.thera.up.DTO.Schedule.ScheduleOption;
import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.entity.Schedule;
import com.rp.thera.up.entity.StressScoreRecord;
import com.rp.thera.up.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/theraup/schedule")
@CrossOrigin(origins = "*")

public class ScheduleController {

    @Autowired
    private SchedulingService schedulingService;

    @PostMapping
    public ResponseEntity<?> scheduleSession(@RequestBody StressScoreRecord record) {
        List<Schedule> options = schedulingService.saveStressScoreRecord(record);
        return ResponseHandler.responseBuilder("Session scheduled successfully",HttpStatus.CREATED,options);

    }

    @PostMapping("/select")
    public ResponseEntity<?> selectSchedule(@RequestBody ScheduleOption scheduleOption) {
        Schedule schedule = schedulingService.selectSchedule(scheduleOption);
        return ResponseHandler.responseBuilder("Session selected successfully",HttpStatus.OK,schedule);
    }

    @GetMapping("/get-schedule-by-doctor/{doctorId}")
    public ResponseEntity<?> getScheduleByDoctor(@PathVariable Long doctorId, @RequestParam String sortBy) {
        List<Schedule> scheduleOptions = schedulingService.getScheduleByDoctor(doctorId, sortBy);
        return ResponseHandler.responseBuilder("Schedule fetched successfully",HttpStatus.OK,scheduleOptions);
    }

    @GetMapping("/get-schedule-by-patient/{patientId}")
    public ResponseEntity<?> getScheduleByPatient(@PathVariable Long patientId, @RequestParam String type, @RequestParam (required = false, defaultValue = "0") Integer count) {
        List<Schedule> scheduleOptions = schedulingService.getScheduleByPatient(patientId, type, count);
        return ResponseHandler.responseBuilder("Schedule fetched successfully",HttpStatus.OK,scheduleOptions);
    }

    @PatchMapping("/rate-session/{sessionId}")
    public ResponseEntity<?> rateSession(@PathVariable String sessionId, @RequestParam double rating) {
        Schedule schedule = schedulingService.rateSession(sessionId, rating);
        return ResponseHandler.responseBuilder("Session rated successfully",HttpStatus.OK,schedule);
    }


}
