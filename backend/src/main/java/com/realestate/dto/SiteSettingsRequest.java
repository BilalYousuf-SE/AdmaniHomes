package com.realestate.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SiteSettingsRequest {

    @Size(max = 150)
    private String realtorName;

    @Size(max = 250)
    private String realtorTitle;

    @Size(max = 2000, message = "Bio must be under 2000 characters")
    private String bio;

    @Size(max = 1000, message = "Mission must be under 1000 characters")
    private String mission;

    private List<@Size(max = 150) String> expertise;

    private String realtorPhotoUrl;

    @Pattern(regexp = "^$|^\\+?[0-9]{7,15}$", message = "Enter a valid WhatsApp number (7-15 digits, optional +country code)")
    private String whatsappNumber;
}