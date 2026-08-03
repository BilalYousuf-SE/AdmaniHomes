package com.realestate.dto;

import com.realestate.model.SiteSettings;

public record SiteSettingsResponse(
        String bio,
        String realtorPhotoUrl,
        String whatsappNumber
) {
    public static SiteSettingsResponse from(SiteSettings s) {
        return new SiteSettingsResponse(s.getBio(), s.getRealtorPhotoUrl(), s.getWhatsappNumber());
    }
}
