package com.rp.thera.up.serviceImpl;

import com.rp.thera.up.DTO.reportDTO.CreateReportDTO;
import com.rp.thera.up.DTO.reportDTO.GetReportDTO;
import com.rp.thera.up.DTO.reportDTO.GetReportPaginatedDTO;
import com.rp.thera.up.customException.GlobalGetException;
import com.rp.thera.up.customException.ReportException;
import com.rp.thera.up.entity.Doctor;
import com.rp.thera.up.entity.Patient;
import com.rp.thera.up.entity.Reports;
import com.rp.thera.up.repo.DoctorRepo;
import com.rp.thera.up.repo.PatientRepo;
import com.rp.thera.up.repo.ReportRepo;
import com.rp.thera.up.service.ReportService;
import com.rp.thera.up.service.StorageService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportRepo reportRepo;

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private StorageService storageService;

    private final String REPORT_FOLDER = "reports";

    private String getFileExtension(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null && originalFileName.lastIndexOf('.') > 0) {
            return originalFileName.substring(originalFileName.lastIndexOf('.'));
        }
        return "";  // default to empty string if no extension is found
    }


    @Override
    @Transactional
    public void createReport(MultipartFile file, CreateReportDTO createReportDTO) throws ReportException {

        int patientId = createReportDTO.getPatient_id();
        int doctorId = createReportDTO.getDoctor_id();
        LocalDate sessionDate = createReportDTO.getSession_date();
        LocalTime sessionTime = createReportDTO.getSession_time();

        //All required fields are mandatory
        if (file.isEmpty() ||
                patientId == 0 ||
                doctorId == 0 ||
                sessionDate == null ||
                sessionTime == null) {
            throw new ReportException("All fields are required", HttpStatus.BAD_REQUEST);
        }

        //Check if the patient and doctor exist
        Patient patient = patientRepo.findById(patientId).orElseThrow(() ->
                new ReportException("Patient not found", HttpStatus.NOT_FOUND));

        Doctor doctor = doctorRepo.findById(doctorId).orElseThrow(() ->
                new ReportException("Doctor not found", HttpStatus.NOT_FOUND));

        String fileExtension = getFileExtension(file);
        String fileUrl = storageService.uploadResource(REPORT_FOLDER,
                doctor.getFull_name() + "_" + patient.getFull_name() + fileExtension, file);

        //Create a new report entity
        Reports report = new Reports();
        report.setReport_url(fileUrl);
        report.setPatient(patient);
        report.setDoctor(doctor);
        report.setSession_date(sessionDate);
        report.setSession_time(sessionTime);
        reportRepo.save(report);
    }

    @Override
    public GetReportDTO getReportById(int id) {
        Reports report = reportRepo.getReportsById(id).orElseThrow(() ->
                new ReportException("Report not found", HttpStatus.NOT_FOUND));

        return modelMapper.map(report, GetReportDTO.class);
    }

    @Override
    public GetReportPaginatedDTO getReportPaginated(int offset, int pageSize, int patientId, int doctorId) {

        List<Reports> reports = reportRepo.getAllReports();

        if (offset < 0 || pageSize < 0) {
            throw new ReportException("Invalid offset or page size", HttpStatus.BAD_REQUEST);
        }

        if (patientId != 0) {
            reports = reports.stream()
                    .filter(report -> report.getPatient().getId() == patientId)
                    .toList();

            if (reports.isEmpty()) {
                throw new ReportException("No reports found for the given patient ID", HttpStatus.NOT_FOUND);
            }
        }

        if (doctorId != 0) {
            reports = reports.stream()
                    .filter(report -> report.getDoctor().getId() == doctorId)
                    .toList();

            if (reports.isEmpty()) {
                throw new ReportException("No reports found for the given doctor ID", HttpStatus.NOT_FOUND);
            }
        }

        if (reports.isEmpty()) {
            throw new ReportException("No reports found", HttpStatus.NOT_FOUND);
        }

        int start = offset * pageSize;
        if (start > reports.size()) {
            throw new GlobalGetException("No reports found on this page");
        }
        int end = Math.min(start + pageSize, reports.size());

        List<Reports> paginatedReports = reports.subList(start, end);

        int totalRecords = reports.size();

        List<GetReportDTO> reportDTOs = modelMapper.map(paginatedReports, new TypeToken<List<GetReportDTO>>() {}
        .getType());

        return new GetReportPaginatedDTO(reportDTOs, totalRecords);
    }
}
