package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.postTherapyDTO.*;
import com.rp.thera.up.customException.PostTherapyException;
import com.rp.thera.up.entity.Activity;
import com.rp.thera.up.entity.PostTherapy;
import com.rp.thera.up.repo.ActivityRepo;
import com.rp.thera.up.repo.PostTherapyRepo;
import com.rp.thera.up.service.PostTherapyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PostTherapyImpl implements PostTherapyService {

    @Autowired
    private PostTherapyRepo postTherapyRepo;

    @Autowired
    private ActivityRepo activityRepo;

    @Override
    public List<SuggestedActivityDTO> suggestActivities(PatientPreferencesDTO preferences) throws PostTherapyException {
        if (preferences == null) {
            throw new PostTherapyException("Preferences are Required", HttpStatus.BAD_REQUEST);
        }

        Specification<Activity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (preferences.getStressLevel() != null) {
                if (preferences.getStressLevel() < 0 || preferences.getStressLevel() > 10) {
                    throw new PostTherapyException("Stress Level must be between 0 and 10", HttpStatus.BAD_REQUEST);
                }
                predicates.add(cb.lessThanOrEqualTo(root.get("minStressLevel"), preferences.getStressLevel()));
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxStressLevel"), preferences.getStressLevel()));
            }
            if (preferences.getPrefersIndoor() != null) {
                predicates.add(cb.equal(root.get("isIndoor"), preferences.getPrefersIndoor()));
            }
            if (preferences.getPrefersPhysical() != null) {
                predicates.add(cb.equal(root.get("isPhysical"), preferences.getPrefersPhysical()));
            }
            if (preferences.getAvailableTimeMinutes() != null) {
                if (preferences.getAvailableTimeMinutes() < 0) {
                    throw new PostTherapyException("Available Time must be non-negative", HttpStatus.BAD_REQUEST);
                }
                predicates.add(cb.lessThanOrEqualTo(root.get("defaultDurationMinutes"), preferences.getAvailableTimeMinutes()));
            }
            if (preferences.getAge() != null) {
                if (preferences.getAge() < 0) {
                    throw new PostTherapyException("Age must be non-negative", HttpStatus.BAD_REQUEST);
                }
                predicates.add(cb.lessThanOrEqualTo(root.get("minAge"), preferences.getAge()));
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxAge"), preferences.getAge()));
            }
            if (preferences.getPrefersCreative() != null) {
                predicates.add(cb.equal(root.get("isCreative"), preferences.getPrefersCreative()));
            }
            if (preferences.getEnergyLevel() != null) {
                if (!List.of("LOW", "MEDIUM", "HIGH").contains(preferences.getEnergyLevel())) {
                    throw new PostTherapyException("Energy Level must be LOW, MEDIUM, or HIGH", HttpStatus.BAD_REQUEST);
                }
                predicates.add(cb.equal(root.get("energyLevel"), preferences.getEnergyLevel()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Activity> recommendedActivities = activityRepo.findAll(spec);
        if (recommendedActivities.isEmpty()) {
            throw new PostTherapyException("No suitable activities found for the given preferences", HttpStatus.NOT_FOUND);
        }

        return recommendedActivities.stream()
                .map(activity -> new SuggestedActivityDTO(
                        activity.getActivity_id(),
                        activity.getName(),
                        activity.getDefaultDurationMinutes()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void createPostTherapy(PostTherapyCreateDTO postTherapyCreateDTO) throws PostTherapyException {
        String patient_id = postTherapyCreateDTO.getPatient_id();
        List<ActivityAssignmentDTO> activities = postTherapyCreateDTO.getActivities();

        if (patient_id == null || patient_id.isEmpty()) {
            throw new PostTherapyException("Patient ID is Required", HttpStatus.BAD_REQUEST);
        }
        if (activities == null || activities.isEmpty()) {
            throw new PostTherapyException("At least one Activity is Required", HttpStatus.BAD_REQUEST);
        }

        List<PostTherapy> postTherapies = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (ActivityAssignmentDTO activityDTO : activities) {
            String activity_id = activityDTO.getActivity_id();
            int allocated_duration = activityDTO.getAllocated_duration();

            if (activity_id == null || activity_id.isEmpty()) {
                throw new PostTherapyException("Activity ID is Required", HttpStatus.BAD_REQUEST);
            }
            if (allocated_duration < 0) {
                throw new PostTherapyException("Allocated Duration must be non-negative for activity " + activity_id, HttpStatus.BAD_REQUEST);
            }

            Activity activity = activityRepo.findById(activity_id)
                    .orElseThrow(() -> new PostTherapyException("Activity " + activity_id + " not found", HttpStatus.NOT_FOUND));

            PostTherapy postTherapy = new PostTherapy();
            postTherapy.setPatient_id(patient_id);
            postTherapy.setActivity(activity);
            postTherapy.setAllocated_duration(allocated_duration);
            postTherapy.setRemaining_time(allocated_duration);
            postTherapy.setCompletion_percentage(0.0);
            postTherapy.setAssignedDate(now);
            postTherapy.setAlertLevel("Good");
            postTherapies.add(postTherapy);
        }

        postTherapyRepo.saveAll(postTherapies);
    }

    @Override
    public PatientProgressDTO getPatientProgress(String patientId) {
        List<PostTherapy> activities = postTherapyRepo.findByPatientId(patientId);
        int totalActivities = activities.size();
        int completedActivities = (int) activities.stream().filter(PostTherapy::isCompleted).count();
        int totalTimeAssigned = activities.stream().mapToInt(PostTherapy::getAllocated_duration).sum();
        int totalTimeRemaining = activities.stream().mapToInt(PostTherapy::getRemaining_time).sum();

        String progressStatus;
        if (completedActivities == totalActivities && totalActivities > 0) {
            progressStatus = "FULL";
        } else if (completedActivities > 0) {
            progressStatus = "PARTIAL";
        } else {
            progressStatus = "NONE";
        }

        List<ActivityProgressDTO> activityProgressList = new ArrayList<>();
        for (PostTherapy postTherapy : activities) {
            updateAlertLevel(postTherapy);
            postTherapyRepo.save(postTherapy);
            ActivityProgressDTO activityProgress = new ActivityProgressDTO(
                    postTherapy.getActivity().getActivity_id(),
                    postTherapy.getActivity().getName(),
                    postTherapy.getCompletion_percentage(),
                    postTherapy.getAlertLevel()
            );
            activityProgressList.add(activityProgress);
        }

        String patientAlertLevel = determinePatientAlertLevel(activities);

        return new PatientProgressDTO(patientId, totalActivities, completedActivities, progressStatus, totalTimeAssigned, totalTimeRemaining, patientAlertLevel, activityProgressList);
    }

    @Override
    public void logActivityCompletion(ActivityCompletionDTO completionDTO) throws PostTherapyException {
        List<PostTherapy> activities = postTherapyRepo.findByPatientId(completionDTO.getPatient_id());
        PostTherapy activity = activities.stream()
                .filter(a -> a.getActivity().getActivity_id().equals(completionDTO.getActivity_id()))
                .findFirst()
                .orElseThrow(() -> new PostTherapyException("Activity not found", HttpStatus.NOT_FOUND));

        activity.setCompleted(completionDTO.isCompleted());
        if (completionDTO.isCompleted()) {
            activity.setRemaining_time(0);
            activity.setCompletion_percentage(100.0);
        } else {
            int allocatedMinutes = activity.getAllocated_duration();
            int remainingMinutes = activity.getRemaining_time();
            activity.setCompletion_percentage(calculateCompletionPercentage(allocatedMinutes, remainingMinutes));
        }
        updateAlertLevel(activity);
        postTherapyRepo.save(activity);

        PatientProgressDTO progress = getPatientProgress(completionDTO.getPatient_id());
        handleProgressActions(progress);
    }

    @Override
    public void updateRemainingTime(UpdateRemainingTimeDTO updateRemainingTimeDTO) throws PostTherapyException {
        if (updateRemainingTimeDTO.getPatient_id() == null || updateRemainingTimeDTO.getPatient_id().isEmpty()) {
            throw new PostTherapyException("Patient ID is Required", HttpStatus.BAD_REQUEST);
        }
        if (updateRemainingTimeDTO.getActivity_id() == null || updateRemainingTimeDTO.getActivity_id().isEmpty()) {
            throw new PostTherapyException("Activity ID is Required", HttpStatus.BAD_REQUEST);
        }
        int remainingTime = updateRemainingTimeDTO.getRemaining_time();
        if (remainingTime < 0) {
            throw new PostTherapyException("Remaining Time must be non-negative", HttpStatus.BAD_REQUEST);
        }

        List<PostTherapy> activities = postTherapyRepo.findByPatientId(updateRemainingTimeDTO.getPatient_id());
        PostTherapy postTherapy = activities.stream()
                .filter(a -> a.getActivity().getActivity_id().equals(updateRemainingTimeDTO.getActivity_id()))
                .findFirst()
                .orElseThrow(() -> new PostTherapyException("Activity " + updateRemainingTimeDTO.getActivity_id() + " not assigned to patient " + updateRemainingTimeDTO.getPatient_id(), HttpStatus.NOT_FOUND));

        int allocatedMinutes = postTherapy.getAllocated_duration();
        if (remainingTime > allocatedMinutes) {
            throw new PostTherapyException("Remaining Time must be between 0 and " + allocatedMinutes, HttpStatus.BAD_REQUEST);
        }

        postTherapy.setRemaining_time(remainingTime);
        if (remainingTime == 0) {
            postTherapy.setCompleted(true);
            postTherapy.setCompletion_percentage(100.0);
        } else {
            postTherapy.setCompleted(false);
            postTherapy.setCompletion_percentage(calculateCompletionPercentage(allocatedMinutes, remainingTime));
        }
        updateAlertLevel(postTherapy);
        postTherapyRepo.save(postTherapy);
    }

    @Override
    public AllPatientsProgressDTO getAllPatientsProgress() {
        List<PostTherapy> allActivities = postTherapyRepo.findAll();
        Map<String, List<PostTherapy>> activitiesByPatient = allActivities.stream()
                .collect(Collectors.groupingBy(PostTherapy::getPatient_id));

        List<PatientProgressSummaryDTO> patientSummaries = new ArrayList<>();
        for (Map.Entry<String, List<PostTherapy>> entry : activitiesByPatient.entrySet()) {
            String patientId = entry.getKey();
            List<PostTherapy> patientActivities = entry.getValue();

            int totalAssignedActivities = patientActivities.size();
            int completedActivities = (int) patientActivities.stream().filter(PostTherapy::isCompleted).count();
            int totalTimeRemaining = patientActivities.stream().mapToInt(PostTherapy::getRemaining_time).sum();
            int totalAllocatedTime = patientActivities.stream().mapToInt(PostTherapy::getAllocated_duration).sum();

            double progressPercentage = totalAllocatedTime == 0 ? 0.0 :
                    ((double) (totalAllocatedTime - totalTimeRemaining) / totalAllocatedTime) * 100;

            patientActivities.forEach(this::updateAlertLevel);
            patientActivities.forEach(postTherapyRepo::save);
            String alertLevel = determinePatientAlertLevel(patientActivities);

            PatientProgressSummaryDTO summary = new PatientProgressSummaryDTO(
                    patientId,
                    totalAssignedActivities,
                    completedActivities,
                    totalTimeRemaining,
                    progressPercentage,
                    alertLevel
            );
            patientSummaries.add(summary);
        }

        return new AllPatientsProgressDTO(patientSummaries);
    }

    @Override
    public void deleteAssignedActivity(String patientId, String activityId) throws PostTherapyException {
        if (patientId == null || patientId.isEmpty()) {
            throw new PostTherapyException("Patient ID is Required", HttpStatus.BAD_REQUEST);
        }
        if (activityId == null || activityId.isEmpty()) {
            throw new PostTherapyException("Activity ID is Required", HttpStatus.BAD_REQUEST);
        }

        List<PostTherapy> activities = postTherapyRepo.findByPatientId(patientId);
        PostTherapy postTherapy = activities.stream()
                .filter(a -> a.getActivity().getActivity_id().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new PostTherapyException("Activity " + activityId + " not assigned to patient " + patientId, HttpStatus.NOT_FOUND));

        postTherapyRepo.delete(postTherapy); // Delete the assigned activity
    }

    private void handleProgressActions(PatientProgressDTO progress) {
        switch (progress.getProgressStatus()) {
            case "FULL":
                System.out.println("Assigning new tasks for patient: " + progress.getPatient_id());
                break;
            case "PARTIAL":
                System.out.println("Warning: Partial completion for patient: " + progress.getPatient_id());
                break;
            case "NONE":
                System.out.println("Alert: No completion for patient: " + progress.getPatient_id() + ". Notifying therapist.");
                break;
        }
    }

    private double calculateCompletionPercentage(int allocatedMinutes, int remainingMinutes) {
        if (allocatedMinutes == 0) return 0.0;
        return ((double) (allocatedMinutes - remainingMinutes) / allocatedMinutes) * 100;
    }

    private void updateAlertLevel(PostTherapy postTherapy) {
        if (postTherapy.getAssignedDate() == null) {
            postTherapy.setAssignedDate(LocalDateTime.now());
        }
        LocalDateTime now = LocalDateTime.now();
        long daysSinceAssigned = ChronoUnit.DAYS.between(postTherapy.getAssignedDate(), now);

        if (daysSinceAssigned >= 3) {
            double progress = postTherapy.getCompletion_percentage();
            if (progress < 25.0) {
                postTherapy.setAlertLevel("Immediate");
            } else if (progress < 75.0) {
                postTherapy.setAlertLevel("Normal");
            } else {
                postTherapy.setAlertLevel("Good");
            }
        } else {
            postTherapy.setAlertLevel("Good");
        }
    }

    private String determinePatientAlertLevel(List<PostTherapy> activities) {
        boolean hasImmediate = activities.stream().anyMatch(a -> "Immediate".equals(a.getAlertLevel()));
        boolean hasNormal = activities.stream().anyMatch(a -> "Normal".equals(a.getAlertLevel()));
        if (hasImmediate) return "Immediate";
        if (hasNormal) return "Normal";
        return "Good";
    }
}