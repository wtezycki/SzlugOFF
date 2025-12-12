package pl.szlugoff.szlugoff.report.dto;

import pl.szlugoff.szlugoff.report.ReportStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReportResponseDto(
        UUID id,
        Double latitude,
        Double longitude,
        ReportStatus status,
        LocalDateTime createdAt
) {}