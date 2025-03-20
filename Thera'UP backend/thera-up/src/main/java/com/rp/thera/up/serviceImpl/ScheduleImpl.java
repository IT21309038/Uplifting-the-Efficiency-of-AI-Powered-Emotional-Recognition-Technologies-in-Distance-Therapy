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

    @Autowired
    private PhysicalInfoRepo patientPhysicalInfoRepository;

    private static final int BUFFER_TIME = 10; // 10-minute break between sessions
    private static final String PAST = "past";
    private static final String UP_COMING = "up_coming";
    private static final int BUFFER_TIME_MINUTES = 60; // 60-minute buffer time before generating a new schedule

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

        // Get the current date and time
        LocalDateTime now = LocalDateTime.now();

        // If the session date is today, ensure the session time is after the current time plus buffer time
        if (date.isEqual(now.toLocalDate())) {
            clinicStartTime = now.toLocalTime().plusMinutes(BUFFER_TIME_MINUTES + 1); // Start after buffer time
        }

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

    @Override
    public List<Schedule> getScheduleByPatient(Long patientId, String type, Integer count) {
        List<Schedule> schedules;

        if (PAST.equals(type)) {
            schedules = scheduleRepository.findByPatientIdAndStatusIn(patientId, List.of("completed", "not completed"));
        } else if (UP_COMING.equals(type)) {
            schedules = scheduleRepository.findByPatientIdAndStatus(patientId, "pending");
        } else {
            throw new IllegalArgumentException("Invalid type: " + type);
        }

        // Sort schedules by date and time
        schedules.sort(Comparator.comparing(Schedule::getDate).thenComparing(Schedule::getTime));

        // If count is provided, limit the number of results
        if (count != null && count > 0) {
            schedules = schedules.stream().limit(count).collect(Collectors.toList());
        }

        return schedules;
    }

    @Override
    public Schedule rateSession(String sessionId, double rating) {
        Schedule schedule = scheduleRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalStateException("Schedule not found"));

        schedule.setRating(rating);
        scheduleRepository.save(schedule);

        return schedule;
    }

    @Override
    public List<Schedule> generateSchedule(Long patientId) {
        // Step 1: Calculate the average stress score
        double averageStressScore = calculateAverageStressScore(patientId);

        // Step 2: Determine the stress level based on the average stress score
        String stressLevel = determineStressLevel(averageStressScore);

        // Step 3: Fetch all doctors
        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            throw new IllegalStateException("No available doctors found.");
        }

        // Step 4: Schedule sessions based on the stress level
        List<Schedule> options = new ArrayList<>();
        LocalDate startDate = LocalDate.now().plusDays(1);
        List<Doctor> availableDoctors = getAvailableDoctors(startDate, doctors);

        int sessionLength = determineSessionLength(stressLevel);

        while (options.size() < 3) {
            if ("High".equals(stressLevel)) {
                // High-stress patients: Assign earliest available slots
                options.addAll(assignSessions(availableDoctors, startDate, sessionLength, 3 - options.size(), Math.toIntExact(patientId)));
            } else if ("Moderate".equals(stressLevel)) {
                // Moderate-stress patients: Assign sessions with a balanced approach
                List<Integer> dayOffsets = Arrays.asList(1, 3, 5);
                for (int offset : dayOffsets) {
                    LocalDate sessionDate = startDate.plusDays(offset);
                    options.addAll(assignSessions(availableDoctors, sessionDate, sessionLength, 1, Math.toIntExact(patientId)));
                    if (options.size() >= 3) {
                        break;
                    }
                }
            } else {
                // Low-stress patients: Assign sessions without prioritizing earliest slots
                List<Integer> dayOffsets = Arrays.asList(2, 5, 8);
                for (int offset : dayOffsets) {
                    LocalDate sessionDate = startDate.plusDays(offset);
                    options.addAll(assignSessions(availableDoctors, sessionDate, sessionLength, 1, Math.toIntExact(patientId)));
                    if (options.size() >= 3) {
                        break;
                    }
                }
            }
            startDate = startDate.plusDays(1); // Move to the next day if not enough sessions are found
        }

        return options;
    }

    @Override
    public List<Schedule> CheckPendingSchedulesByPatientId(Long patientId) {
        return scheduleRepository.findByPatientIdAndStatus(patientId, "pending");
    }

    @Override
    public List<Schedule> getAllSchedulesByPatientAndStatus(Long patientId, String status) {
        return scheduleRepository.findByPatientIdAndStatus(patientId, status);
    }

    @Override
    public Schedule paySession(String sessionId) {
        Schedule schedule = scheduleRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        schedule.setPaymentStatus("completed");
        return scheduleRepository.save(schedule);
    }

    private double calculateAverageStressScore(Long patientId) {
        // Fetch the latest PatientPhysicalInfo
        PatientPhysicalInfo physicalInfo = patientPhysicalInfoRepository.findLatestPhysicalInfoByPatientId(patientId)
                .orElseThrow(() -> new IllegalStateException("Patient physical info not found"));

        // Fetch the latest StressScoreRecord
        Optional<StressScoreRecord> latestStressScoreRecord = stressScoreRecordRepository.findLatestStressScoreRecordByPatientId(patientId.toString());

        // Normalize PatientPhysicalInfo.stressScore to a 0-1 scale
        double physicalInfoStressScore = physicalInfo.getStressScore() / 40.0;

        // Use StressScoreRecord.stressScore as is (already in 0-1+ scale)
        double stressRecordStressScore = latestStressScoreRecord.map(StressScoreRecord::getStressScore).orElse(0.0F);

        // Calculate the average stress score
        if (latestStressScoreRecord.isPresent()) {
            return (physicalInfoStressScore + stressRecordStressScore) / 2.0;
        } else {
            // If no StressScoreRecord exists, use only the normalized PatientPhysicalInfo score
            return physicalInfoStressScore;
        }
    }

    private String determineStressLevel(double stressScore) {
        if (stressScore > 0.8) {
            return "High";
        } else if (stressScore >= 0.4) {
            return "Moderate";
        } else {
            return "Low";
        }
    }

    private int determineSessionLength(String stressLevel) {
        switch (stressLevel) {
            case "High":
                return 60; // 60 minutes for high-stress patients
            case "Moderate":
                return 45; // 45 minutes for moderate-stress patients
            case "Low":
            default:
                return 30; // 30 minutes for low-stress patients
        }
    }


}
