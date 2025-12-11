package pl.szlugoff.szlugoff.report.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReportRequestDto(
        @NotNull(message="{validation.latitude.required}")
        @Min(-90) @Max(90)
        Double latitude,

        @NotNull(message="{validation.longitude.required}")
        @Min(-180) @Max(180)
        Double longitude,

        String description
) {}
