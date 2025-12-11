package pl.szlugoff.szlugoff.report;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ReportStatus {
    NEW("Nowe"),
    CONFIRMED("Zatwierdzone"),
    REJECTED("Odrzucone"),
    IN_PROGRESS("W trakcie weryfikacji");

    private final String polishName;
}
