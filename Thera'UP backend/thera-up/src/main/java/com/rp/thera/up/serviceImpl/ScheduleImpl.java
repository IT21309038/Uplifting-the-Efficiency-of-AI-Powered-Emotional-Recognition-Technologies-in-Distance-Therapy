package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.Schedule.ScheduleOption;
import com.rp.thera.up.DTO.Schedule.SessionCodeGenerator;
import com.rp.thera.up.entity.*;
import com.rp.thera.up.repo.*;
import com.rp.thera.up.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleImpl implements SchedulingService {

    @Autowired
    private DoctorRepo doctorRepository;

    @Autowired
    private PatientRepo patientRepository;

    @Autowired
    private TherapistLeaveRepository therapistLeaveRepository;

    @Autowired
    private StressScoreRecordRepository stressScoreRecordRepository;

    @Autowired
    private ScheduleRepo scheduleRepository;

    private static final int BUFFER_TIME = 10; // 10-minute break between sessions

    @Override
    public List<Schedule> scheduleSession(StressScoreRecord record) {
        int patientId = Integer.parseInt(record.getPatientId());
        float stressScore = record.getStressScore();
        int sessionLength = determineSessionLength(stressScore);

        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            throw new IllegalStateException("No available doctors found.");
        }

        List<Schedule> options = new ArrayList<>();
        LocalDate startDate = LocalDate.now().plusDays(1);
        List<Doctor> availableDoctors = getAvailableDoctors(startDate, doctors);

        while (options.size() < 3) {
            if (stressScore > 0.7f) {
                // **HIGH-STRESS PATIENTS: Assign Earliest Available Slots**
                options.addAll(assignSessions(availableDoctors, startDate, sessionLength, 3 - options.size(), patientId));
            } else {
                // **MODERATE/LOW-STRESS PATIENTS: Follow Fixed Non-Sequential Pattern**
                List<Integer> dayOffsets = Arrays.asList(1, 4, 7);
                for (int offset : dayOffsets) {
                    LocalDate sessionDate = startDate.plusDays(offset);
                    options.addAll(assignSessions(availableDoctors, sessionDate, sessionLength, 1, patientId));
                    if (options.size() >= 3) {
                        break;
                    }
                }
            }
            startDate = startDate.plusDays(1); // Move to the next day if not enough sessions are found
        }

        return options;
    }

    /**
     * **Finds doctors who are not on leave or off on the given date.**
     */
    private List<Doctor> getAvailableDoctors(LocalDate date, List<Doctor> doctors) {
        return doctors.stream()
                .filter(doc -> !therapistLeaveRepository.existsByDoctorIdAndLeaveDate(doc.getId(), date))
                .filter(doc -> !isDoctorOffDay(doc, date))
                .collect(Collectors.toList());
    }

    private boolean isDoctorOffDay(Doctor doctor, LocalDate date) {
        List<TherapistLeave> leaves = therapistLeaveRepository.findByDoctorIdAndOffDay(doctor.getId(), date.getDayOfWeek());
        return !leaves.isEmpty();
    }

    /**
     * **Assigns sessions evenly among doctors with the earliest available slots.**
     */
    private List<Schedule> assignSessions(List<Doctor> doctors, LocalDate date, int sessionLength, int count, int patientId) {
        List<Schedule> schedules = new ArrayList<>();
        int doctorIndex = 0;

        while (schedules.size() < count && !doctors.isEmpty()) {
            Doctor doctor = doctors.get(doctorIndex % doctors.size());
            Optional<LocalTime> availableTime = findAvailableTimeSlot(doctor, date, sessionLength);

            if (availableTime.isPresent()) {
                String sessionCode = SessionCodeGenerator.generateSessionCode();
                Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new IllegalStateException("Patient not found"));
                schedules.add(new Schedule(sessionCode, patient, doctor, date, availableTime.get(), sessionLength, "pending", "pending", 0.0));
            }

            doctorIndex++;
            if (doctorIndex >= doctors.size()) break; // Prevent infinite loop
        }

        return schedules;
    }

    /**
     * **Finds an available time slot dynamically based on clinic hours and existing sessions.**
     */
    private Optional<LocalTime> findAvailableTimeSlot(Doctor doctor, LocalDate date, int sessionLength) {
        LocalTime clinicStartTime = LocalTime.of(9, 0);
        LocalTime clinicEndTime = LocalTime.of(17, 0);

        List<Schedule> existingSchedules = scheduleRepository.findByDoctorIdAndDate(doctor.getId(), date);
        existingSchedules.sort(Comparator.comparing(Schedule::getTime));

        LocalTime currentTime = clinicStartTime;

        for (Schedule existing : existingSchedules) {
            LocalTime existingStart = existing.getTime();
            int existingDuration = existing.getSessionDuration();
            LocalTime existingEnd = existingStart.plusMinutes(existingDuration);

            LocalTime latestPossibleStart = existingStart.minusMinutes(sessionLength + BUFFER_TIME);
            if (!currentTime.isAfter(latestPossibleStart) &&
                    currentTime.plusMinutes(sessionLength).isBefore(existingStart.minusMinutes(BUFFER_TIME))) {
                return Optional.of(currentTime);
            }

            currentTime = existingEnd.plusMinutes(BUFFER_TIME);

            if (currentTime.plusMinutes(sessionLength).isAfter(clinicEndTime)) {
                return Optional.empty();
            }
        }

        if (!currentTime.plusMinutes(sessionLength).isAfter(clinicEndTime)) {
            return Optional.of(currentTime);
        }

        return Optional.empty();
    }

    private int determineSessionLength(float stressScore) {
        if (stressScore > 0.7f) {
            return 60; // 60 minutes for high-stress patients
        } else {
            return 30; // 30 minutes for moderate/low-stress patients
        }
    }



    @Override
    public List<Schedule> saveStressScoreRecord(StressScoreRecord record) {
        // Save stress score record
        StressScoreRecord newRecord = new StressScoreRecord();
        newRecord.setPatientId(record.getPatientId());
        newRecord.setStressScore(record.getStressScore());
        newRecord.setStressLevel(record.getStressLevel());
        newRecord.setErrorRate(record.getErrorRate());
        newRecord.setAverageReactionTime(record.getAverageReactionTime());
        newRecord.setCreatedAt(LocalDateTime.ofInstant(new Date().toInstant(), ZoneId.systemDefault()));

        stressScoreRecordRepository.save(newRecord);

        return scheduleSession(newRecord);
    }

    @Override
    public Schedule selectSchedule(ScheduleOption scheduleOption) {
        Schedule newSchedule = new Schedule();

        newSchedule.setSession_id(scheduleOption.getSessionCode());
        newSchedule.setDate(scheduleOption.getDate());
        newSchedule.setTime(scheduleOption.getTime());
        newSchedule.setSessionDuration(scheduleOption.getSessionLength());
        newSchedule.setPatient(patientRepository.findById(scheduleOption.getPatientId()).orElseThrow(() -> new IllegalStateException("Patient not found")));
        newSchedule.setDoctor(doctorRepository.findById(scheduleOption.getDoctorId()).orElseThrow(() -> new IllegalStateException("Doctor not found")));
        newSchedule.setStatus("pending");
        newSchedule.setPaymentStatus("pending");
        newSchedule.setRating(0.0);

        scheduleRepository.save(newSchedule);
        return newSchedule;
    }

    public List<Schedule> getScheduleByDoctor(Long doctorId, String sortBy) {
        // Parse the sortBy parameter to extract year and month
        String[] parts = sortBy.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        // Get the start and end dates for the specified month and year
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Retrieve and filter schedules
        List<Schedule> schedules = scheduleRepository.findByDoctorIdAndStatusAndDateBetween(
                doctorId, "pending", startDate, endDate);

        // Sort schedules by date and time
        schedules.sort(Comparator.comparing(Schedule::getDate).thenComparing(Schedule::getTime));

        return schedules;
    }
}
