package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.doctorDTO.CreateDoctorDTO;
import com.rp.thera.up.DTO.doctorDTO.LoginDoctorDTO;
import com.rp.thera.up.DTO.doctorDTO.SucessLoginDoctorDTO;
import com.rp.thera.up.customException.DoctorException;
import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.repo.DoctorRepo;
import com.rp.thera.up.repo.RoleRepo;
import com.rp.thera.up.service.DoctorService;
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
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Doctor createDoctor(CreateDoctorDTO createDoctorDTO) {

        String email = createDoctorDTO.getEmail();
        int role_id = createDoctorDTO.getRole_id();

        if (doctorRepo.findByEmail(email) != null) {
            throw new DoctorException("Doctor with email " + email + " already exists", HttpStatus.CONFLICT);
        }

        //role id must be a valid role id
        if (roleRepo.findById(role_id) == null || role_id != 2) {
            throw new DoctorException("Role with id " + role_id + " is not valid", HttpStatus.BAD_REQUEST);
        }

        //all fields must be filled
        if (createDoctorDTO.getFirst_name() == null || createDoctorDTO.getFirst_name().isEmpty() ||
                createDoctorDTO.getLast_name() == null || createDoctorDTO.getLast_name().isEmpty() ||
                createDoctorDTO.getLicense_number() == null || createDoctorDTO.getLicense_number().isEmpty() ||
                createDoctorDTO.getQualification() == null || createDoctorDTO.getQualification().isEmpty() ||
                createDoctorDTO.getGender() == null || createDoctorDTO.getGender().isEmpty() ||
                createDoctorDTO.getEmail() == null || createDoctorDTO.getEmail().isEmpty() ||
                createDoctorDTO.getPassword() == null || createDoctorDTO.getPassword().isEmpty()) {
            throw new DoctorException("All fields must be filled", HttpStatus.BAD_REQUEST);
        }

        //license number must be unique
        if (doctorRepo.findByLicenseNumber(createDoctorDTO.getLicense_number()) != null) {
            throw new DoctorException("Doctor with license number " + createDoctorDTO.getLicense_number() + " already exists", HttpStatus.CONFLICT);
        }

        Doctor doctor = new Doctor();
        doctor.setFirst_name(createDoctorDTO.getFirst_name());
        doctor.setLast_name(createDoctorDTO.getLast_name());
        doctor.setFull_name(createDoctorDTO.getFirst_name() + " " + createDoctorDTO.getLast_name());
        doctor.setLicense_number(createDoctorDTO.getLicense_number());
        doctor.setQualification(createDoctorDTO.getQualification());
        doctor.setGender(createDoctorDTO.getGender());
        doctor.setEmail(createDoctorDTO.getEmail());
        doctor.setPassword(createDoctorDTO.getPassword());
        doctor.setRole(roleRepo.findById(role_id));
        doctor.setCreated_at(new Date(System.currentTimeMillis()));

        return doctorRepo.save(doctor);
    }

    @Override
    public SucessLoginDoctorDTO doctorLogin(LoginDoctorDTO loginDoctorDTO) {

        //all fields must be filled
        if (loginDoctorDTO.getEmail() == null || loginDoctorDTO.getEmail().isEmpty() ||
                loginDoctorDTO.getPassword() == null || loginDoctorDTO.getPassword().isEmpty()) {
            throw new DoctorException("All fields must be filled", HttpStatus.BAD_REQUEST);
        }

        String email = loginDoctorDTO.getEmail();
        String password = loginDoctorDTO.getPassword();

        Doctor doctor = doctorRepo.findByEmail(email);

        if(doctor == null){
            throw new DoctorException("Doctor with email " + email + " not found", HttpStatus.NOT_FOUND);
        }

        //password must match password is saved encrypted
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        boolean isValid = passwordEncoder.matches(password, doctor.getPassword());

        if(!isValid){
            throw new DoctorException("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        SucessLoginDoctorDTO successLoginDoctorDTO = modelMapper.map(doctor, SucessLoginDoctorDTO.class);
        successLoginDoctorDTO.setFirst_name(doctor.getFirst_name());
        successLoginDoctorDTO.setLast_name(doctor.getLast_name());
        successLoginDoctorDTO.setFull_name(doctor.getFull_name());
        successLoginDoctorDTO.setEmail(doctor.getEmail());
        successLoginDoctorDTO.setRole(doctor.getRole());

        return successLoginDoctorDTO;
    }
}