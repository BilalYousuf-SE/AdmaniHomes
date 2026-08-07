package com.realestate.service;

import com.realestate.dto.SiteSettingsRequest;
import com.realestate.dto.SiteSettingsResponse;
import com.realestate.model.SiteSettings;
import com.realestate.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SiteSettingsService {

    private static final Long SETTINGS_ID = 1L;

    private final SiteSettingsRepository siteSettingsRepository;

    @Transactional(readOnly = true)
    public SiteSettingsResponse get() {
        return SiteSettingsResponse.from(getOrCreate());
    }

    @Transactional
    public SiteSettingsResponse update(SiteSettingsRequest request) {
        SiteSettings settings = getOrCreate();
        settings.setRealtorName(request.getRealtorName());
        settings.setRealtorTitle(request.getRealtorTitle());
        settings.setBio(request.getBio());
        settings.setMission(request.getMission());
        settings.setExpertise(request.getExpertise() != null ? request.getExpertise() : new java.util.ArrayList<>());
        settings.setRealtorPhotoUrl(request.getRealtorPhotoUrl());
        settings.setWhatsappNumber(request.getWhatsappNumber());
        settings.setEmail(request.getEmail());
        settings.setInstagramUrl(request.getInstagramUrl());
        settings.setFacebookUrl(request.getFacebookUrl());
        settings.setLinkedinUrl(request.getLinkedinUrl());
        return SiteSettingsResponse.from(siteSettingsRepository.save(settings));
    }

    private SiteSettings getOrCreate() {
        return siteSettingsRepository.findById(SETTINGS_ID).orElseGet(() -> {
            SiteSettings fresh = new SiteSettings();
            return siteSettingsRepository.save(fresh);
        });
    }
}