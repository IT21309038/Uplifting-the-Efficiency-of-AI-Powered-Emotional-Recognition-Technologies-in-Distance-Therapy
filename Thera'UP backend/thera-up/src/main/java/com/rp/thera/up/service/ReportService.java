package com.rp.thera.up.service;

import com.rp.thera.up.DTO.reportDTO.CreateReportDTO;
import com.rp.thera.up.DTO.reportDTO.GetReportDTO;
import com.rp.thera.up.DTO.reportDTO.GetReportPaginatedDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ReportService {

    void createReport(MultipartFile file, CreateReportDTO createReportDTO);

    GetReportDTO getReportById(int id);

    GetReportPaginatedDTO getReportPaginated(int offset, int pageSize, int patientId, int doctorId);
}
