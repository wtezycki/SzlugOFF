package pl.szlugoff.szlugoff.report;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.szlugoff.szlugoff.report.dto.ReportRequestDto;
import pl.szlugoff.szlugoff.report.dto.ReportResponseDto;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;

    public ReportResponseDto createReport(ReportRequestDto request) {
        Report report = reportMapper.toEntity(request);
        Report savedReport = reportRepository.save(report);
        return reportMapper.toDto(savedReport);
    }

    public List<ReportResponseDto> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return reportMapper.toDtoList(reports);
    }
}
