package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.Schedule.SessionCodeGenerator;
import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.entity.Schedule;
import com.rp.thera.up.entity.StressScoreRecord;
import com.rp.thera.up.entity.TherapistLeave;
import com.rp.thera.up.repo.DoctorRepo;
import com.rp.thera.up.repo.ScheduleRepo;
import com.rp.thera.up.repo.StressScoreRecordRepository;
import com.rp.thera.up.repo.TherapistLeaveRepository;
import com.rp.thera.up.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleImpl implements SchedulingService {

    @Autowired
    private DoctorRepo doctorRepository;

    @Autowired
    private TherapistLeaveRepository therapistLeaveRepository;

    @Autowired
    private StressScoreRecordRepository stressScoreRecordRepository;

    @Autowired
    private ScheduleRepo scheduleRepository;

    private static final int BUFFER_TIME = 10; // 10-minute break between sessions

    public List<Schedule> scheduleSession(StressScoreRecord record) {
        int patientId = Integer.parseInt(record.getPatientId());
        float stressScore = record.getStressScore();
        int sessionLength = determineSessionLength(stressScore);

        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            throw new IllegalStateException("No available doctors found.");
        }

        List<Schedule> options = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        Date startDate = calendar.getTime();
        List<Doctor> availableDoctors = getAvailableDoctors(startDate, doctors);

        while (options.size() < 3) {
            if (stressScore > 0.7f) {
                // **HIGH-STRESS PATIENTS: Assign Earliest Available Slots**
                options.addAll(assignSessions(availableDoctors, startDate, sessionLength, 3 - options.size(), patientId));
            } else {
                // **MODERATE/LOW-STRESS PATIENTS: Follow Fixed Non-Sequential Pattern**
                int[] dayOffsets = {1, 4, 7};
                for (int offset : dayOffsets) {
                    calendar.setTime(startDate);
                    calendar.add(Calendar.DAY_OF_YEAR, offset);
                    Date sessionDate = calendar.getTime();
                    options.addAll(assignSessions(availableDoctors, sessionDate, sessionLength, 1, patientId));
                    if (options.size() >= 3) {
                        break;
                    }
                }
            }
            calendar.setTime(startDate);
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            startDate = calendar.getTime(); // Move to the next day if not enough sessions are found
        }

        return options;
    }

    /**
     * **Finds doctors who are not on leave or off on the given date.**
     */
    private List<Doctor> getAvailableDoctors(Date date, List<Doctor> doctors) {
        return doctors.stream()
                .filter(doc -> !therapistLeaveRepository.existsByDoctorIdAndLeaveDate(doc.getId(), date))
                .filter(doc -> !isDoctorOffDay(doc, date))
                .collect(Collectors.toList());
    }

    private boolean isDoctorOffDay(Doctor doctor, Date date) {
        DayOfWeek dayOfWeek = date.toInstant().atZone(ZoneId.systemDefault()).getDayOfWeek();
        List<TherapistLeave> leaves = therapistLeaveRepository.findByDoctorIdAndOffDay(doctor.getId(), dayOfWeek);
        return !leaves.isEmpty();
    }

    /**
     * **Assigns sessions evenly among doctors with the earliest available slots.**
     */
    public List<Schedule> assignSessions(List<Doctor> doctors, Date date, int sessionLength, int count, int patientId) {
        List<Schedule> schedules = new ArrayList<>();
        int doctorIndex = 0;

        while (schedules.size() < count && !doctors.isEmpty()) {
            Doctor doctor = doctors.get(doctorIndex % doctors.size());
            Optional<Date> availableTime = findAvailableTimeSlot(doctor, date, sessionLength);

            if (availableTime.isPresent()) {
                String sessionCode = SessionCodeGenerator.generateSessionCode();
                schedules.add(new Schedule(sessionCode, patientId, doctor.getId(), date, availableTime.get(), sessionLength, "pending"));
            }

            doctorIndex++;
            if (doctorIndex >= doctors.size()) break; // Prevent infinite loop
        }

        return schedules;
    }

    /**
     * **Finds an available time slot dynamically based on clinic hours and existing sessions.**
     */
    private Optional<Date> findAvailableTimeSlot(Doctor doctor, Date date, int sessionLength) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        Date clinicStartTime = calendar.getTime();

        calendar.set(Calendar.HOUR_OF_DAY, 17);
        Date clinicEndTime = calendar.getTime();

        List<Schedule> existingSchedules = scheduleRepository.findByDoctorIdAndDate(doctor.getId(), date);
        existingSchedules.sort(Comparator.comparing(Schedule::getTime));

        Date currentTime = clinicStartTime;

        for (Schedule existing : existingSchedules) {
            Date existingStart = existing.getTime();
            int existingDuration = existing.getSessionDuration();
            calendar.setTime(existingStart);
            calendar.add(Calendar.MINUTE, existingDuration);
            Date existingEnd = calendar.getTime();

            calendar.setTime(existingStart);
            calendar.add(Calendar.MINUTE, -(sessionLength + BUFFER_TIME));
            Date latestPossibleStart = calendar.getTime();

            calendar.setTime(existingStart);
            calendar.add(Calendar.MINUTE, -BUFFER_TIME);
            Date earliestExistingStart = calendar.getTime();

            if (!currentTime.after(latestPossibleStart) && currentTime.before(earliestExistingStart)) {
                return Optional.of(currentTime);
            }

            calendar.setTime(existingEnd);
            calendar.add(Calendar.MINUTE, BUFFER_TIME);
            currentTime = calendar.getTime();

            if (currentTime.after(clinicEndTime)) {
                return Optional.empty();
            }
        }

        if (!currentTime.after(clinicEndTime)) {
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
        newRecord.setCreatedAt(new Date(System.currentTimeMillis()));

        stressScoreRecordRepository.save(newRecord);

        return scheduleSession(newRecord);
    }

    @Override
    public Schedule selectSchedule(Schedule schedule) {
        scheduleRepository.save(schedule);
        return schedule;
    }
}
