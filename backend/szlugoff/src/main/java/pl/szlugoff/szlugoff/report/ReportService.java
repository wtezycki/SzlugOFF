package pl.szlugoff.szlugoff.report;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.szlugoff.szlugoff.exceptions.ReportNotFoundException;
import pl.szlugoff.szlugoff.report.dto.ReportRequestDto;
import pl.szlugoff.szlugoff.report.dto.ReportResponseDto;
import pl.szlugoff.szlugoff.report.dto.ReportSearchRequestDto;

import java.util.List;
import java.util.UUID;

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

    public List<ReportResponseDto> getReports(ReportSearchRequestDto request) {
        List<Report> reports;

        reports = reportRepository.findReportsAround(
                request.latitude(),
                request.longitude(),
                request.getRadiusOrDefault()
        );
        return reportMapper.toDtoList(reports);
    }

    @Transactional
    public ReportResponseDto updateReportStatus(UUID id, ReportStatus newStatus) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ReportNotFoundException("Zgłoszenie nie istnieje"));

        report.setStatus(newStatus);

        Report saved = reportRepository.save(report);
        return reportMapper.toDto(saved);
    }

    public List<ReportResponseDto> getReportsForAuthority(ReportSearchRequestDto request, List<ReportStatus> statuses) {
        List<String> statusStrings = (statuses == null || statuses.isEmpty())
                ? List.of(ReportStatus.NEW.name(), ReportStatus.IN_PROGRESS.name())
                : statuses.stream().map(Enum::name).toList();

        List<Report> reports = reportRepository.findReportsAroundWithStatus(
                request.latitude(),
                request.longitude(),
                request.getRadiusOrDefault(),
                statusStrings
        );
        return reportMapper.toDtoList(reports);
    }
}
