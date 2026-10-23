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
        String additionalPhotoUrl,
        String secondRealtorName,
        String secondRealtorTitle,
        String secondBio,
        String secondaryWhatsappQrUrl,
        String secondaryWhatsappNumber,
        String whatsappNumber,
        String email,
        String instagramUrl,
        String facebookUrl,
        String linkedinUrl
) {
    public static SiteSettingsResponse from(SiteSettings s) {
        return new SiteSettingsResponse(
                s.getRealtorName(), s.getRealtorTitle(), s.getBio(), s.getMission(),
                s.getExpertise(), s.getRealtorPhotoUrl(), s.getAdditionalPhotoUrl(),
                s.getSecondRealtorName(), s.getSecondRealtorTitle(), s.getSecondBio(),
                s.getSecondaryWhatsappQrUrl(), s.getSecondaryWhatsappNumber(), s.getWhatsappNumber(),
                s.getEmail(), s.getInstagramUrl(), s.getFacebookUrl(), s.getLinkedinUrl()
        );
    }
}