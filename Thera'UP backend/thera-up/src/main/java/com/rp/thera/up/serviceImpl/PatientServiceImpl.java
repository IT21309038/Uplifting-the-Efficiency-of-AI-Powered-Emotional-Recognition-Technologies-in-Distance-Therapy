package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.patientDTO.*;
import com.rp.thera.up.customException.PatientException;
import com.rp.thera.up.entity.*;
import com.rp.thera.up.repo.*;
import com.rp.thera.up.service.PatientService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private GeneralInfoRepo generalInfoRepo;

    @Autowired
    private PhysicalInfoRepo physicalInfoRepo;

    @Autowired
    private GeneralInfoRepo patientGeneralInfoRepo;

    @Autowired
    private PhysicalInfoRepo patientPhysicalInfoRepo;

    @Autowired
    private ScheduleRepo scheduleRepo;

    @Autowired
    private StressScoreRecordRepository stressScoreRecodeRepo;


    @Override
    public void createPatient(PatientPostDTO patientPostDTO) throws PatientException {

        String full_name = patientPostDTO.getFull_name();
        String email = patientPostDTO.getEmail();
        String password = patientPostDTO.getPassword();
        String gender = patientPostDTO.getGender().toLowerCase();
        String phone = patientPostDTO.getPhone();
        Date dob = patientPostDTO.getDob();

        //all fields must be filled
        if (full_name == null || full_name.isEmpty() ||
                email == null || email.isEmpty() ||
                password == null || password.isEmpty() ||
                gender.isEmpty() ||
                phone == null || phone.isEmpty() ||
                dob == null) {
            throw new PatientException("All fields must be filled", HttpStatus.BAD_REQUEST);
        }

        //check if email is unique
        if (patientRepo.findByEmail(email).isPresent()) {
            throw new PatientException("Patient with email " + email + " already exists", HttpStatus.CONFLICT);
        }

        //email validation
        if (!email.matches("^(.+)@(.+)$")) {
            throw new PatientException("Invalid email", HttpStatus.BAD_REQUEST);
        }

        //gender must be either male of female
        if (!gender.equals("male") && !gender.equals("female")) {
            throw new PatientException("Invalid gender type", HttpStatus.BAD_REQUEST);
        }

        //phone number must be a 10 digit number
        if (!phone.matches("\\d{10}")) {
            throw new PatientException("Invalid phone number", HttpStatus.BAD_REQUEST);
        }

        Patient patient = new Patient();
        patient.setFull_name(full_name);
        patient.setEmail(email);
        patient.setPassword(password);
        patient.setGender(gender);
        patient.setPhone(phone);
        patient.setDob(dob);
        patient.setRole(roleRepo.findById(3));
        patient.setJoined_at(new Date(System.currentTimeMillis()));

        patientRepo.save(patient);
    }

    @Override
    public PatientGetDTO loginPatient(LoginPatientDTO loginPatientDTO) {

        String email = loginPatientDTO.getEmail();
        String password = loginPatientDTO.getPassword();

        //all fields must be filled
        if (email == null || email.isEmpty() ||
                password == null || password.isEmpty()) {
            throw new PatientException("All fields must be filled", HttpStatus.BAD_REQUEST);
        }

        Patient patient = patientRepo.findByEmail(email).orElseThrow(() ->
                new PatientException("Patient with email " + email + " does not exist", HttpStatus.NOT_FOUND));

        //password must match password is saved encrypted
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        boolean isValid = passwordEncoder.matches(password, patient.getPassword());

        if (!isValid) {
            throw new PatientException("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        return modelMapper.map(patient, PatientGetDTO.class);
    }

    @Override
    public PatientGetDTO getPatient(Integer id) {

        Patient patient = patientRepo.findById(id).orElseThrow(() ->
                new PatientException("Patient with id " + id + " does not exist", HttpStatus.NOT_FOUND));

        if (patient == null) {
            throw new PatientException("Patient with id " + id + " does not exist", HttpStatus.NOT_FOUND);
        }

        return modelMapper.map(patient, PatientGetDTO.class);
    }

    @Override
    public List<PatientGetDTO> getPatients() {

        List<Patient> patients = patientRepo.findAll();

        if (patients.isEmpty()) {
            throw new PatientException("No patients found", HttpStatus.NOT_FOUND);
        }

        return modelMapper.map(patients, new TypeToken<List<PatientGetDTO>>() {
        }.getType());
    }

    @Override
    public void updatePatient(Integer id, PatientUpdateDTO patientUpdateDTO) {

        String full_name = patientUpdateDTO.getFull_name();
        String gender = patientUpdateDTO.getGender();
        String phone = patientUpdateDTO.getPhone();
        Date dob = patientUpdateDTO.getDob();

        Patient patient = patientRepo.findById(id).orElseThrow(() ->
                new PatientException("Patient with id " + id + " does not exist", HttpStatus.NOT_FOUND));

        if (full_name != null && !full_name.isEmpty()) {
            patient.setFull_name(full_name);
        }

        if (gender != null && !gender.isEmpty()) {
            //gender must be either male of female
            String genderLowerCase = gender.toLowerCase();
            if (!genderLowerCase.equals("male") && !genderLowerCase.equals("female")) {
                throw new PatientException("Invalid gender type", HttpStatus.BAD_REQUEST);
            }
            patient.setGender(genderLowerCase);
        }

        if (phone != null && !phone.isEmpty()) {
            //phone number must be a 10 digit number
            if (!phone.matches("\\d{10}")) {
                throw new PatientException("Invalid phone number", HttpStatus.BAD_REQUEST);
            }
            patient.setPhone(phone);
        }

        if (dob != null) {
            patient.setDob(dob);
        }

        patientRepo.save(patient);
    }

    @Override
    public void updatePatientPassword(Integer id, PatientPasswordUpdateDTO patientPasswordUpdateDTO) {

        String password = patientPasswordUpdateDTO.getPassword();

        Patient patient = patientRepo.findById(id).orElseThrow(() ->
                new PatientException("Patient with id " + id + " does not exist", HttpStatus.NOT_FOUND));

        if (password.isEmpty()) {
            throw new PatientException("Password must be filled", HttpStatus.BAD_REQUEST);
        }

        patient.setPassword(password);

        patientRepo.save(patient);
    }

    @Override
    public void saveGeneralInfo(GeneralInfoDTO generalInfoDTO) {

            Integer patient_id = Integer.valueOf(generalInfoDTO.getPatientId());
            String empStatus = generalInfoDTO.getEmpStatus();
            String civilStatus = generalInfoDTO.getCivilStatus();
            String livingStatus = generalInfoDTO.getLivingStatus();
            String income = generalInfoDTO.getIncome();
            String socialLife = generalInfoDTO.getSocialLife();

            //all fields must be filled
            if (empStatus == null || empStatus.isEmpty() ||
                    civilStatus == null || civilStatus.isEmpty() ||
                    livingStatus == null || livingStatus.isEmpty() ||
                    income == null || income.isEmpty() ||
                    socialLife == null || socialLife.isEmpty()) {
                throw new PatientException("All fields must be filled", HttpStatus.BAD_REQUEST);
            }

            Patient patient = patientRepo.findById(patient_id).orElseThrow(() ->
                    new PatientException("Patient with id " + patient_id + " does not exist", HttpStatus.NOT_FOUND));

            PatientGeneralInfo patientGeneralInfo = new PatientGeneralInfo();
            patientGeneralInfo.setPatient(patient);
            patientGeneralInfo.setEmpStatus(empStatus);
            patientGeneralInfo.setCivilStatus(civilStatus);
            patientGeneralInfo.setLivingStatus(livingStatus);
            patientGeneralInfo.setIncome(income);
            patientGeneralInfo.setSocialLife(socialLife);
            patientGeneralInfo.setCreatedAt(new Date(System.currentTimeMillis()));

            generalInfoRepo.save(patientGeneralInfo);
    }

    @Override
    public GeneralInfoDTO getGeneralInfo(String patientId) {

        Patient patient = patientRepo.findById(Integer.valueOf(patientId)).orElseThrow(() ->
                new PatientException("Patient with id " + patientId + " does not exist", HttpStatus.NOT_FOUND));

        PatientGeneralInfo patientGeneralInfo = generalInfoRepo.findByPatientId(Integer.valueOf(patientId));
        if (patientGeneralInfo == null) {
            throw new PatientException("General info for patient with id " + patientId + " does not exist", HttpStatus.NOT_FOUND);
        }

        return modelMapper.map(patientGeneralInfo, GeneralInfoDTO.class);
    }

    @Override
    public void savePhysicalInfo(PhysicalInfoDTO physicalInfoDTO) {
        Patient patient = patientRepo.findById(Integer.valueOf(physicalInfoDTO.getPatientId()))
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PatientPhysicalInfo physicalInfo = new PatientPhysicalInfo();
        physicalInfo.setPatient(patient);
        physicalInfo.setSleepOption(physicalInfoDTO.getSleepOption());
        physicalInfo.setEatOption(physicalInfoDTO.getEatOption());
        physicalInfo.setOverwhelmedOption(physicalInfoDTO.getOverwhelmedOption());
        physicalInfo.setAngryOption(physicalInfoDTO.getAngryOption());
        physicalInfo.setFocusOption(physicalInfoDTO.getFocusOption());
        physicalInfo.setMemoryOption(physicalInfoDTO.getMemoryOption());
        physicalInfo.setSocialOption(physicalInfoDTO.getSocialOption());
        physicalInfo.setPhysicalOption(physicalInfoDTO.getPhysicalOption());
        physicalInfo.setNegativeOption(physicalInfoDTO.getNegativeOption());
        physicalInfo.setStressScore(physicalInfoDTO.getStressScore());
        physicalInfo.setCreatedAt(new Date(System.currentTimeMillis()));

        physicalInfoRepo.save(physicalInfo);

    }

    @Override
    public ReportDTO getReport(String patientId) {
        Patient patient = patientRepo.findById(Integer.valueOf(patientId))
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        PatientGeneralInfo latestGeneralInfo = patientGeneralInfoRepo.findTopByPatientOrderByCreatedAtDesc(patient);
        PatientPhysicalInfo latestPhysicalInfo = patientPhysicalInfoRepo.findTopByPatientOrderByCreatedAtDesc(patient);
        Schedule latestSchedule = scheduleRepo.findTopByPatientOrderByDateDescTimeDesc(patient);

        // Fetch the latest stressScoreRecode
        StressScoreRecord latestStressScoreRecode = stressScoreRecodeRepo.findTopByPatientIdOrderByCreatedAtDesc(patientId);

        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setPatient(patient);
        reportDTO.setLatestGeneralInfo(latestGeneralInfo);
        reportDTO.setLatestPhysicalInfo(latestPhysicalInfo);
        reportDTO.setLatestSchedule(latestSchedule);
        reportDTO.setLatestStressScoreRecord(latestStressScoreRecode); // Set the latest stressScoreRecode

        return reportDTO;
    }
}
