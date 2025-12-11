package pl.szlugoff.szlugoff.report.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReportRequestDto(
        @NotNull(message="Szerokość graficzna jest wymagana")
        @Min(-90) @Max(90)
        Double latitude,

        @NotNull(message="Długość geograficzna jest wymagana")
        @Min(-180) @Max(180)
        Double longitude,

        String description
) {}
