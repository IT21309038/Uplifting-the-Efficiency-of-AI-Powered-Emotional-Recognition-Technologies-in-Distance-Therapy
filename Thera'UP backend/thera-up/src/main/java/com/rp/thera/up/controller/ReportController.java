package com.rp.thera.up.controller;

import com.rp.thera.up.DTO.reportDTO.CreateReportDTO;
import com.rp.thera.up.DTO.reportDTO.GetReportDTO;
import com.rp.thera.up.DTO.reportDTO.GetReportPaginatedDTO;
import com.rp.thera.up.ResponseHandler;
import com.rp.thera.up.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/theraup")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping(path = "reports/create", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createReport(@RequestParam("file") MultipartFile file,
                                          @RequestPart("report")CreateReportDTO reportDTO) {
        reportService.createReport(file, reportDTO);
        return ResponseHandler.responseBuilder("Report created successfully", HttpStatus.CREATED, null);
    }

    @GetMapping(value = "reports/get-report/{id}")
    public ResponseEntity<?> getReportById(@PathVariable int id) {
        GetReportDTO reportDTO = reportService.getReportById(id);
        return ResponseHandler.responseBuilder("Report retrieved successfully", HttpStatus.OK, reportDTO);
    }

    @GetMapping(value = "reports/get-report-paginated/{offset}/{pageSize}")
    public ResponseEntity<?> getReportPaginated(@PathVariable int offset,
                                                @PathVariable int pageSize,
                                                @RequestParam(value = "patientId", required = false) int patientId,
                                                @RequestParam(value = "doctorId", required = false) int doctorId) {
        GetReportPaginatedDTO reportPaginatedDTO = reportService.getReportPaginated(offset, pageSize, patientId, doctorId);
        return ResponseHandler.responseGetBuilder("Report paginated", HttpStatus.OK, reportPaginatedDTO.getReports(), reportPaginatedDTO.getTotalCount());
    }
}
