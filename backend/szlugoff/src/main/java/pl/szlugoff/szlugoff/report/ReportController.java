package pl.szlugoff.szlugoff.report;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.szlugoff.szlugoff.report.dto.ReportRequestDto;
import pl.szlugoff.szlugoff.report.dto.ReportResponseDto;
import pl.szlugoff.szlugoff.report.dto.ReportSearchRequestDto;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> createReport(@RequestBody @Valid ReportRequestDto request){
        ReportResponseDto response = reportService.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping()
    public ResponseEntity<List<ReportResponseDto>> getAllReports(@ModelAttribute ReportSearchRequestDto request) {
        return ResponseEntity.ok(reportService.getReports(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReportResponseDto> updateReportStatus(@PathVariable("id") UUID id,
                                                                @RequestParam ReportStatus status) {
        ReportResponseDto updatedReport = reportService.updateReportStatus(id, status);
        return ResponseEntity.ok(updatedReport);
    }


    @GetMapping("/authorities")
    public ResponseEntity<List<ReportResponseDto>> getAuthoritiesReports(@ModelAttribute ReportSearchRequestDto request,
                                                                         @RequestParam(required = false) List<ReportStatus> statuses) {
        return ResponseEntity.ok(reportService.getReportsForAuthority(
                request, statuses
        ));
    }
}
