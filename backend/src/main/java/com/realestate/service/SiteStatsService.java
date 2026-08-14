package com.realestate.service;

import com.realestate.model.SiteStats;
import com.realestate.repository.SiteStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SiteStatsService {

    private static final Long STATS_ID = 1L;

    private final SiteStatsRepository siteStatsRepository;

    @Transactional
    public void recordVisit() {
        int updated = siteStatsRepository.incrementVisits(STATS_ID);
        if (updated == 0) {
            // First ever visit - the row doesn't exist yet, create it.
            SiteStats stats = new SiteStats();
            stats.setTotalVisits(1L);
            siteStatsRepository.save(stats);
        }
    }

    @Transactional(readOnly = true)
    public long getTotalVisits() {
        return siteStatsRepository.findById(STATS_ID)
                .map(SiteStats::getTotalVisits)
                .orElse(0L);
    }
}
