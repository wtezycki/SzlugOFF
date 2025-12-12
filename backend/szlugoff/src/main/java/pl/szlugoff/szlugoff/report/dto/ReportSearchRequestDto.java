package pl.szlugoff.szlugoff.report.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReportSearchRequestDto(
        @Min(-90) @Max(90)
        Double latitude,

        @Min(-180) @Max(180)
        Double longitude,

        // Radius given in m
        @Min(value = 10, message="{validation.radius.required}")
        Double radius
)
{
    public Double getRadiusOrDefault() {
        return radius != null ? radius : 1000.0;
    }
}


