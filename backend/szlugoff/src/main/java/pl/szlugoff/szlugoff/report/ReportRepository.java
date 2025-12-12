package pl.szlugoff.szlugoff.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    // Find active reports in radius
    @Query(value = """
        SELECT * FROM reports r 
        WHERE ST_DWithin(
            r.location::geography, 
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, 
            :radius
        ) 
        AND r.status = 'NEW'
        """, nativeQuery = true)
    List<Report> findReportsAround(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius
    );

    // DELETE FROM reports WHERE created_at < :date
    void deleteByCreatedAtBefore(LocalDateTime date);
}
