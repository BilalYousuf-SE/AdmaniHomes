package com.realestate.repository;

import com.realestate.model.SiteStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SiteStatsRepository extends JpaRepository<SiteStats, Long> {

    // Atomic UPDATE at the database level - safer than read-then-write in
    // Java, which could lose increments if two visits land at the same time.
    @Modifying
    @Query("UPDATE SiteStats s SET s.totalVisits = s.totalVisits + 1 WHERE s.id = :id")
    int incrementVisits(@Param("id") Long id);
}
