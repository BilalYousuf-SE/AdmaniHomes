package com.realestate.controller;

import com.realestate.service.SiteStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class SiteStatsController {

    private final SiteStatsService siteStatsService;

    // Public - the frontend calls this once per page load. No auth needed,
    // and it deliberately returns nothing informative so it can't be used
    // to read the count back out anonymously.
    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void track() {
        siteStatsService.recordVisit();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getStats() {
        return Map.of("totalVisits", siteStatsService.getTotalVisits());
    }
}
