package pl.szlugoff.szlugoff.report;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportCleanerService {

    private final ReportRepository reportRepository;

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void removeOldReports() {
        log.info("Removing old reports:");

        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        reportRepository.deleteByCreatedAtBefore(cutoff);
        log.info("Removed reports older than " + cutoff);

    }
}
