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

@RestController
@RequestMapping("api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> createReport(@RequestBody @Valid ReportRequestDto request){
        ReportResponseDto response = reportService.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping()
    public ResponseEntity<List<ReportResponseDto>> getAllReports(@RequestBody @Valid ReportSearchRequestDto request) {
        return ResponseEntity.ok(reportService.getReports(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportResponseDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }


}
