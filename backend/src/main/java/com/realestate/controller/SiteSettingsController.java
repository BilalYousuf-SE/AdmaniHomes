package com.realestate.controller;

import com.realestate.dto.SiteSettingsRequest;
import com.realestate.dto.SiteSettingsResponse;
import com.realestate.service.SiteSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SiteSettingsController {

    private final SiteSettingsService siteSettingsService;

    // Public - powers the homepage hero/about section
    @GetMapping
    public SiteSettingsResponse get() {
        return siteSettingsService.get();
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SiteSettingsResponse update(@Valid @RequestBody SiteSettingsRequest request) {
        return siteSettingsService.update(request);
    }
}
