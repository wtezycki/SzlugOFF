package pl.szlugoff.szlugoff.report;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

public enum ReportStatus {
    NEW,
    ACTIVE,
    CONFIRMED,
    REJECTED,
    IN_PROGRESS;
}
