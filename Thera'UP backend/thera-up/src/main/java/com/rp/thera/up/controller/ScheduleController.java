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

    @GetMapping("/generate-schedule/{patientId}")
    public ResponseEntity<?> generateSchedule(@PathVariable Long patientId) {
        List<Schedule> scheduleOptions = schedulingService.generateSchedule(patientId);
        return ResponseHandler.responseBuilder("Schedule generated successfully",HttpStatus.OK,scheduleOptions);
    }

    @GetMapping("/check-schedules/{patientId}")
    public ResponseEntity<?> checkSchedules(@PathVariable Long patientId) {
        List<Schedule> pendingSchedules = schedulingService.CheckPendingSchedulesByPatientId(patientId);
        if (!pendingSchedules.isEmpty()) {
            return ResponseHandler.responseBuilder("There are pending sessions", HttpStatus.OK, pendingSchedules);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/get-all-schedule-by-patient/{patientId}")
    public ResponseEntity<?> getScheduleByPatient(@PathVariable Long patientId, @RequestParam String status) {
        List<Schedule> scheduleOptions = schedulingService.getAllSchedulesByPatientAndStatus(patientId, status);
        return ResponseHandler.responseBuilder("Schedule fetched successfully", HttpStatus.OK, scheduleOptions);
    }

    @PatchMapping("/pay-session/{sessionId}")
    public ResponseEntity<?> paySession(@PathVariable String sessionId) {
        Schedule schedule = schedulingService.paySession(sessionId);
        return ResponseHandler.responseBuilder("Session paid successfully", HttpStatus.OK, schedule);
    }

    @DeleteMapping("/delete-pending-sessions/{patientId}")
    public ResponseEntity<?> deletePendingSessions(@PathVariable Long patientId) {
        schedulingService.deletePendingSessions(patientId);
        return ResponseHandler.responseBuilder("Pending sessions deleted successfully", HttpStatus.OK, null);
    }


}
