package pl.szlugoff.szlugoff.report.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReportResponseDto(
        UUID id,
        Double latitude,
        Double longitude,
        String status,
        LocalDateTime createdAt
) {}