package pl.szlugoff.szlugoff.report;

import pl.szlugoff.szlugoff.report.dto.ReportRequestDto;
import pl.szlugoff.szlugoff.report.dto.ReportResponseDto;

import java.util.List;

public interface ReportService {

    public ReportResponseDto createReport(ReportRequestDto request);
    public List<ReportResponseDto> getAllReports();
}
