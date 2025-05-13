package com.rp.thera.up.DTO.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetReportPaginatedDTO {

    private List<GetReportDTO> reports;
    private int totalCount;
}
