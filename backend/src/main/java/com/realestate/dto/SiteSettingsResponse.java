package com.realestate.dto;

import com.realestate.model.SiteSettings;

import java.util.List;

public record SiteSettingsResponse(
        String realtorName,
        String realtorTitle,
        String bio,
        String mission,
        List<String> expertise,
        String realtorPhotoUrl,
        String whatsappNumber
) {
    public static SiteSettingsResponse from(SiteSettings s) {
        return new SiteSettingsResponse(
                s.getRealtorName(), s.getRealtorTitle(), s.getBio(), s.getMission(),
                s.getExpertise(), s.getRealtorPhotoUrl(), s.getWhatsappNumber()
        );
    }
}